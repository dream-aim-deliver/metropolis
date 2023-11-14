import { BaseDTO } from '@/lib/sdk/dto'
import { ArangoDBConnectionDTO } from '../../dto/arangodb-dto'

export default interface ArangoDBRepositoryOutputPort {
  /**
   * Creates a new database in ArangoDB. if not exists. If exists, use the existing one
   * @param Optional databaseName, if not provided, the database name will be taken from the environment variables
   * @returns A promise that resolves to a ${@link BaseDTO} object
   */
  useOrCreateDatabase(databaseName?: string | undefined): Promise<ArangoDBConnectionDTO<any>>
}
