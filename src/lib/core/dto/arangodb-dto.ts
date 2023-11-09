import { BaseDTO } from '@/lib/sdk/dto'

/**
 * ArangoDBInitDTO contains information about status of connecting and initializing ArangoDB
 */
export interface ArangoDBInitDTO<DB> extends BaseDTO {
  db?: DB | undefined
}
