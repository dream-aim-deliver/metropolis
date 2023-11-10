import { BaseDTO } from '@/lib/sdk/dto'

/**
 * ArangoDBInitDTO contains information about status of connecting and initializing ArangoDB
 */
export interface ArangoDBInitDTO<DB> extends BaseDTO {
  arangoDB?: DB | undefined
}

/**
 * ArangoDBCollectionDTO contains information about status of creating a collection in ArangoDB
 * @typeparam TDocument The type of the documents int the collection
 * @typeparam TCollection The type of the collection
 */
export interface ArangoDBCollectionDTO<TDocument, TCollection> extends BaseDTO {
  collection?: TCollection | undefined
}