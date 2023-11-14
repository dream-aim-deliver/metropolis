import { BaseDTO } from '@/lib/sdk/dto'

/**
 * ArangoDBInitDTO contains information about status of connecting and initializing ArangoDB
 */
export interface ArangoDBConnectionSuccessDTO<DB> extends BaseDTO {
  status: 'success',
  arangoDB: DB | undefined
}

/**
 * ArangoDBInitDTO contains information about status of connecting and initializing ArangoDB
 */
export interface ArangoDBConnectionErrorDTO extends BaseDTO {
  status: 'error',
  errorType: string | undefined,
  errorCode: number | undefined,
  errorMessage: string
}

export type ArangoDBConnectionDTO<DB> = ArangoDBConnectionSuccessDTO<DB> | ArangoDBConnectionErrorDTO

/**
 * ArangoDBCollectionDTO contains information about status of creating a collection in ArangoDB
 * @typeparam TDocument The type of the documents int the collection
 * @typeparam TCollection The type of the collection
 */
export interface ArangoDBCollectionDTO<TDocument, TCollection> extends BaseDTO {
  collection?: TCollection | undefined
}

/**
 * ArangoDBdocumentDTO contains information about status of a document in ArangoDB
 */
export interface ArangoDBdocumentDTO<TDocument> extends BaseDTO {
  document?: TDocument | undefined
}