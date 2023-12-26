import { inject, injectable } from 'inversify'
import { ArangoDBConnectionDTO as ArangoDBConnectionDTO, ArangoDBEnvVariablesDTO } from '@/lib/core/dto/arangodb-dto'
import ArangoDBRepositoryOutputPort from '@/lib/core/port/secondary/arangodb-repository-output-port'
import GATEWAYS from '../ioc/ioc-symbols-gateway'
import type EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port'
import { Database } from 'arangojs'
import { BaseDTO } from '@/lib/sdk/dto'

@injectable()
class ArangoDBRepository implements ArangoDBRepositoryOutputPort<Database> {
  constructor(@inject(GATEWAYS.ENV_CONFIG) private envConfig: EnvConfigGatewayOutputPort) {}

  async _exportEnvironmentVariables(): Promise<ArangoDBEnvVariablesDTO> {
    try {
      const { URL, PORT, DATABASE, USERNAME, PASSWORD } = this.envConfig.arangoDBConfig()
      if ([URL, PORT, DATABASE, USERNAME, PASSWORD].some(value => value === undefined)) {
        return {
          status: 'error',
          errorCode: 500,
          errorType: 'Env Config Gateway',
          errorMessage: 'Missing at least one environment variable for ArangoDB configuration. Environment variables required: URL, PORT, USERNAME, PASSWORD, DATABASE',
        }
      }
      return {
        status: 'success',
        URL,
        PORT,
        DATABASE,
        USERNAME,
        PASSWORD,
      }
    } catch (error: any) {
      return { status: 'error', errorType: error.name, errorCode: error.code, errorMessage: error.message }
    }
  }

  async _repristineDataBase(dbName: string): Promise<BaseDTO> {
    if (!dbName) {
      return { status: 'error', errorCode: 500, errorType: 'ArangoDB Repo', errorMessage: 'No database name provided as an argument. Will not repristine anything.' }
    }

    const connectionDTO = await this.useOrCreateDatabase(dbName)
    if (connectionDTO.status === 'error' || !connectionDTO.arangoDB) {
      return { status: 'error', errorType: 'ArangoDB Repo', errorMessage: connectionDTO.errorMessage }
    }

    const db = connectionDTO.arangoDB

    try {
      // Delete all colletions in the database
      const collections = await db.listCollections()
      for (const collection of collections) {
        console.log(`Dropping collection ${collection.name}`)
        await db.collection(collection.name).drop()
      }

      // TODO: Create the default collections reading from another file or something
      const collection_name = `${db.name}Entity`
      await db.collection(collection_name).create()

      return { status: 'success' }
    } catch (error: any) {
      return { status: 'error', errorType: error.name, errorCode: error.code, errorMessage: error.message }
    }
  }

  async useOrCreateDatabase(databaseName?: string): Promise<ArangoDBConnectionDTO<Database>> {
    try {
      const { URL, PORT, DATABASE, USERNAME, PASSWORD } = this.envConfig.arangoDBConfig()

      if ([URL, PORT, databaseName || DATABASE, USERNAME, PASSWORD].some(value => value === undefined)) {
        return {
          status: 'error',
          errorCode: 500,
          errorType: 'Env Config Gateway',
          errorMessage:
            'Missing environment variables for ArangoDB configuration. Note that, apart from URL, PORT, USERNAME, and PASSWORD, you need to pass either the "databaseName" (: string) parameter or provide a DATABASE environment variable',
        }
      }
    } catch (error: any) {
      return { status: 'error', errorType: error.name, errorCode: error.code, errorMessage: error.message }
    }

    // If databaseName is provided, it takes precedence over the DATABASE environment variable
    const dbName = databaseName || this.envConfig.arangoDBConfig().DATABASE

    if (!dbName) {
      return {
        status: 'error',
        errorCode: 500,
        errorType: 'Env Config Gateway',
        errorMessage: 'No database name provided as an argument or as an environment variable',
      }
    }
    try {
      // NOTE: this object is the _system database
      const system_db = new Database({
        url: `${this.envConfig.arangoDBConfig().URL}:${this.envConfig.arangoDBConfig().PORT}`,
        auth: { username: this.envConfig.arangoDBConfig().USERNAME, password: this.envConfig.arangoDBConfig().PASSWORD },
      })

      // This object is the database we want to use, but this command doesn't create it
      let db: Database
      db = system_db.database(dbName)

      // We need to check if the database exists...
      if (!(await db.exists())) {
        // ...and explicitly create it if it doesn't
        db = await system_db.createDatabase(dbName)
      }
      // Note that the logic above replaces the old .use() method
      return {
        status: 'success',
        arangoDB: db,
        arangoSystemDB: system_db,
      }
    } catch (error: any) {
      return {
        status: 'error',
        errorType: error.name,
        errorCode: error.code,
        errorMessage: error.message,
      }
    }
  }
}

export default ArangoDBRepository
