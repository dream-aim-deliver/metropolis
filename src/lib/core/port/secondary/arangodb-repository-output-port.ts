import { BaseDTO } from '@/lib/sdk/dto'
import { ArangoDBInitDTO } from '../../dto/arangodb-dto'

export default interface ArangoDBRepositoryOutputPort {
  /**
   * Initializes the ArangoDB database connection
   * 
   */
  connect(useDefaultDatabase: boolean): Promise<ArangoDBInitDTO<any>>

  /**
   * Creates a new database in ArangoDB
   * @param Optional databaseName, if not provided, the database name will be taken from the environment variables
   * @returns A promise that resolves to a ${@link BaseDTO} object
   */
  createDatabase(databaseName?: string | undefined): Promise<BaseDTO>
}
