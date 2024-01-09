import { inject, injectable } from 'inversify'
import { ArangoDBConnectionDTO as ArangoDBConnectionDTO } from '@/lib/core/dto/arangodb-dto'
import ArangoDBRepositoryOutputPort from '@/lib/core/port/secondary/arangodb-repository-output-port'
import GATEWAYS from '../ioc/ioc-symbols-gateway'
import type EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port'
import { Database } from 'arangojs'
import { BaseDTO } from '@/lib/sdk/dto'

@injectable()
class ArangoDBRepository implements ArangoDBRepositoryOutputPort<Database> {
  constructor(@inject(GATEWAYS.ENV_CONFIG) private envConfig: EnvConfigGatewayOutputPort) {}

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
      const conf = this.envConfig.arangoDBConfig()
      const dbName = databaseName || conf.DATABASE

      // NOTE: this object is the _system database
      const system_db = new Database({
        url: `${conf.URL}:${conf.PORT}`,
        auth: { username: conf.USERNAME, password: conf.PASSWORD },
      })

      // This object is the database we want to use, but this command doesn't create it
      let db: Database
      db = system_db.database(dbName)

      // We need to check if the database exists...
      if (!(await db.exists())) {
        // ...and explicitly create it if it doesn't
        db = await system_db.createDatabase(dbName)
      }
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
