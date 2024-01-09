import ArangoDBCollectionRepositoryOutputPort from '@/lib/core/port/secondary/arangodb-collection-repository-output-port'
import type ArangoDBRepositoryOutputPort from '@/lib/core/port/secondary/arangodb-repository-output-port'
import { inject, injectable } from 'inversify'
import REPOSITORY from '../ioc/ioc-symbols-repository'
import type { ArangoDBCollectionDTO, ArangoDBConnectionDTO } from '@/lib/core/dto/arangodb-dto'
import { Database } from 'arangojs'
import { DocumentCollection, EdgeCollection } from 'arangojs/collection'

@injectable()
class ArangoDBCollectionRepository implements ArangoDBCollectionRepositoryOutputPort {
  arangoDB: Database | undefined
  constructor(@inject(REPOSITORY.ARANGODB) private arangoDBRepository: ArangoDBRepositoryOutputPort<Database>) {}

  /**
   * Initializes the ArangoDB connection and returns the Database object. Meant to be used internally, as it doesn't return a DTO. Throws an error if the connection fails.
   */
  private async _initialize(databaseName?: string): Promise<Database> {
    if (this.arangoDB) return this.arangoDB

    const arangoConnectDTO: ArangoDBConnectionDTO<Database> = await this.arangoDBRepository.useOrCreateDatabase(databaseName)

    if (arangoConnectDTO.status === 'error' || !arangoConnectDTO.arangoDB) {
      throw new Error(`Failed to initialize ArangoDB. ${arangoConnectDTO.errorMessage}`)
    }

    return arangoConnectDTO.arangoDB
  }

  async createDocumentCollection<TDocument extends Record<string, any>>(
    collectionName: string,
    databaseName?: string,
  ): Promise<ArangoDBCollectionDTO<TDocument, DocumentCollection<TDocument>>> {
    try {
      this.arangoDB = await this._initialize(databaseName)
      const arangoDB = this.arangoDB

      // check if collection already exists, create if not
      const collection: DocumentCollection<TDocument> = arangoDB.collection<TDocument>(collectionName)

      if (await collection.exists()) {
        return {
          status: 'error',
          errorType: 'Arango Collection Repo Error',
          errorMessage: `Document collection ${collectionName} already exists. Please use a different name.`,
        }
      }

      const documentCollection: DocumentCollection<TDocument> = await arangoDB.createCollection<TDocument>(collectionName)

      if (!(await documentCollection.exists())) {
        return {
          status: 'error',
          errorType: 'Arango Collection Repo Error',
          errorMessage: `Failed to create ${collectionName}, even though it doesn't exist`,
        }
      }

      return {
        status: 'success',
        collection: documentCollection,
      }
    } catch (error: any) {
      return {
        status: 'error',
        errorType: 'Arango Collection Repo Error',
        errorMessage: `Failed to create ${collectionName}. ${error.message}`,
      }
    }
  }

  async createEdgeCollection<TEdge extends Record<string, any>>(collectionName: string, databaseName?: string): Promise<ArangoDBCollectionDTO<TEdge, EdgeCollection<TEdge>>> {
    try {
      this.arangoDB = await this._initialize(databaseName)
      const arangoDB = this.arangoDB

      // check if collection already exists, create if not
      const collection: EdgeCollection<TEdge> = arangoDB.collection<TEdge>(collectionName)

      if (await collection.exists()) {
        return {
          status: 'error',
          errorType: 'Arango Collection Repo Error',
          errorMessage: `Edge collection ${collectionName} already exists. Please use a different name.`,
        }
      }

      const edgeCollection: EdgeCollection<TEdge> = await arangoDB.createEdgeCollection<TEdge>(collectionName)

      if (!(await edgeCollection.exists())) {
        return {
          status: 'error',
          errorType: 'Arango Collection Repo Error',
          errorMessage: `Failed to create ${collectionName}`,
        }
      }
      return {
        status: 'success',
        collection: edgeCollection,
      }
    } catch (error: any) {
      return {
        status: 'error',
        errorType: 'Arango Collection Repo Error',
        errorMessage: `Failed to create ${collectionName}. ${error.message}`,
      }
    }
  }
}

export default ArangoDBCollectionRepository
