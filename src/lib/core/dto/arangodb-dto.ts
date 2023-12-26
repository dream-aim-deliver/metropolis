import { BaseDTO } from '@/lib/sdk/dto'

/**
 * ArangoDBInitDTO contains information about status of connecting and initializing ArangoDB. Returns both the database object and the system database object. The system database object has as name "_system" in all ArangoDB projects. To create or drop databases, we need to use the system database object.
 */
export interface ArangoDBConnectionSuccessDTO<DB> extends BaseDTO {
  status: 'success'
  arangoDB: DB
  arangoSystemDB: DB
}

/**
 * ArangoDBInitDTO contains information about status of connecting and initializing ArangoDB
 */
export interface ArangoDBConnectionErrorDTO extends BaseDTO {
  status: 'error'
  errorType: string | undefined
  errorCode: number | undefined
  errorMessage: string
}

export type ArangoDBConnectionDTO<DB> = ArangoDBConnectionSuccessDTO<DB> | ArangoDBConnectionErrorDTO

/**
 * ArangoDBEnvVariablesDTO contains the values of the environment variables required for ArangoDB
 */
export interface ArangoDBEnvVariablesDTO extends BaseDTO {
  URL?: string
  PORT?: number
  DATABASE?: string
  USERNAME?: string
  PASSWORD?: string
}

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
