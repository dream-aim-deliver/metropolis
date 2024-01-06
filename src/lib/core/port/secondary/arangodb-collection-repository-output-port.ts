import { BaseDTO } from '@/lib/sdk/dto'
import { ArangoDBCollectionDTO } from '../../dto/arangodb-dto'

export default interface ArangoDBCollectionRepositoryOutputPort {
  /**
   * Creates a new document collection in ArangoDB if it does not already exist. If a database name is provided, the collection will be created in that database. If the database name is of a non-existing database, it will be created. Otherwise, the collection will be created in the default database.
   * Returns false if the collection already exists.
   * @param collectionName The name of the collection to create
   * @typeparam T The type of the collection
   * @returns A promise that resolves to a ${@link BaseDTO} object
   */
  createDocumentCollection<TDocument extends Record<string, any>>(collectionName: string, databaseName?: string): Promise<ArangoDBCollectionDTO<TDocument, any>>

  /**
   * Creates a new edge collection in ArangoDB if it does not already exist. If a database name is provided, the collection will be created in that database. If the database name is of a non-existing database, it will be created. Otherwise, the collection will be created in the default database.
   * Returns false if the collection already exists.
   * @param collectionName The name of the edge collection to create
   * @typeparam TEdge The type of the edge collection
   * @returns A promise that resolves to a ${@link BaseDTO} object
   */
  createEdgeCollection<TEdge extends Record<string, any>>(collectionName: string, databaseName?: string): Promise<ArangoDBCollectionDTO<TEdge, any>>
}
