import { BaseDTO } from '@/lib/sdk/dto'
import { ArangoDBConnectionDTO, ArangoDBEnvVariablesDTO } from '../../dto/arangodb-dto'

export default interface ArangoDBRepositoryOutputPort<DB> {
  /**
   * Export the environment variables. Mainly to check which ones are read and if they're read correctly.
   */
  _exportEnvironmentVariables(): Promise<ArangoDBEnvVariablesDTO>

  /**
   * Drops all data from the database and renitializes a clean, empty state.
   *
   * # WARNING: ERASES ALL DATA!
   *
   * @returns A promise that resolves to a ${@link BaseDTO} object
   */
  _repristineDataBase(databaseName: string): Promise<BaseDTO>

  /**
   * Creates a new database in ArangoDB. if not exists. If exists, use the existing one
   * @param Optional databaseName, if not provided, the database name will be taken from the environment variables
   * @returns A promise that resolves to a ${@link BaseDTO} object
   */
  useOrCreateDatabase(databaseName?: string | undefined): Promise<ArangoDBConnectionDTO<DB>>
}
