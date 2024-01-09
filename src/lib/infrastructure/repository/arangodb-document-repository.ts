import ArangoDBDocumentRepositoryOutputPort from '@/lib/core/port/secondary/arangogb-document-repository-output-port'
import { inject, injectable } from 'inversify'
import REPOSITORY from '../ioc/ioc-symbols-repository'
import type ArangoDBRepositoryOutputPort from '@/lib/core/port/secondary/arangodb-repository-output-port'
import { Database } from 'arangojs/database'
import { ArangoDBConnectionDTO, ArangoDBdocumentDTO } from '@/lib/core/dto/arangodb-dto'
import { DocumentCollection, EdgeCollection } from 'arangojs/collection'
import { DocumentMetadata, EdgeData } from 'arangojs/documents'

@injectable()
class ArangoDBDocumentRepository implements ArangoDBDocumentRepositoryOutputPort {
  arangoDB: Database | undefined
  constructor(@inject(REPOSITORY.ARANGODB) private arangoDBRepository: ArangoDBRepositoryOutputPort<Database>) {}

  /**
   * Initializes the ArangoDB connection and returns the Database object. Meant to be used internally, as it doesn't return a DTO. Throws an error if the connection fails.
   */
  private async _initialize(databaseName?: string): Promise<Database> {
    if (this.arangoDB) return this.arangoDB

    const arangoConnectDTO: ArangoDBConnectionDTO<Database> = await this.arangoDBRepository.useOrCreateDatabase(databaseName)

    if (arangoConnectDTO.status === 'error' || !arangoConnectDTO.arangoDB) {
      throw new Error(`_initialize: Failed to initialize ArangoDB. ${arangoConnectDTO.errorMessage}`)
    }

    return arangoConnectDTO.arangoDB
  }

  async createDocument<TDocument extends Record<string, any> | EdgeData>(
    collectionName: string,
    document: TDocument,
    databaseName?: string,
  ): Promise<ArangoDBdocumentDTO<DocumentMetadata & { new?: any }>> {
    try {
      this.arangoDB = await this._initialize(databaseName)
      const arangoDB = this.arangoDB

      let collection: DocumentCollection | EdgeCollection | undefined = undefined

      // check if collection already exists
      const result = await arangoDB?.listCollections()
      if (!result) return { status: 'error', errorType: 'Arango Error', errorMessage: `Failed to list existing Collections in ArangoDB. ${result}` }

      for (const col of result) {
        if (col.name === collectionName) {
          collection = this.arangoDB?.collection(collectionName)
        }
      }

      if (!collection) {
        return { status: 'error', errorType: 'Arango Error', errorMessage: `Collection ${collectionName} does not exist. Please create it before adding documents.` }
      }
      const doc = await collection.save(document)
      return { status: 'success', document: doc }
    } catch (error: any) {
      return { status: 'error', errorType: 'Arango Error', errorMessage: `Failed to create Document in ${collectionName}. ${error.message}` }
    }
  }

  async createDocuments<TDocument extends Record<string, any> | EdgeData>(
    collectionName: string,
    documents: TDocument[],
    databaseName?: string,
  ): Promise<ArangoDBdocumentDTO<DocumentMetadata & { new?: any }>> {
    try {
      this.arangoDB = await this._initialize(databaseName)
      const arangoDB = this.arangoDB

      const collection: DocumentCollection | EdgeCollection = arangoDB.collection(collectionName)
      if (!(await collection.exists())) {
        return {
          status: 'error',
          errorType: 'Arango Error',
          errorMessage: `Collection ${collectionName} does not exist. Please create it before adding documents.`,
        }
      }

      // TODO: assert that this actually happens
      await collection.saveAll(documents)
      return { status: 'success' }
    } catch (error: any) {
      return {
        status: 'error',
        errorType: 'Arango Error',
        errorMessage: `Failed to create Document in ${collectionName}. ${error.message}`,
      }
    }
  }
}

export default ArangoDBDocumentRepository
