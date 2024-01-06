import { DocumentMetadata } from 'arangojs/documents'
import { ArangoDBdocumentDTO } from '../../dto/arangodb-dto'

export default interface ArangoDBDocumentRepositoryOutputPort {
  /**
   * Creates a new document in a collection in ArangoDB. If the collection does not exist, it will return an error. If a database name is not provided, the default database from the environment variables will be used. If the database name is of a non-existing database, it will be created.
   * @param collectionName The name of the collection where the document will be created
   * @param document The document to be created
   */
  createDocument<TDocument extends Record<string, any>>(
    collectionName: string,
    document: TDocument,
    databaseName?: string,
  ): Promise<ArangoDBdocumentDTO<DocumentMetadata & { new?: any }>>

  /**
   * Creates new documents in a collection in ArangoDB. If the collection does not exist, it will return an error. If a database name is not provided, the default database from the environment variables will be used. If the database name is of a non-existing database, it will be created.
   */
  createDocuments<TDocument extends Record<string, any>>(
    collectionName: string,
    documents: TDocument[],
    databaseName?: string,
  ): Promise<ArangoDBdocumentDTO<DocumentMetadata & { new?: any }>>
}
