import { inject, injectable } from 'inversify'
import { ArangoDBInitDTO } from '@/lib/core/dto/arangodb-dto'
import ArangoDBRepositoryOutputPort from '@/lib/core/port/secondary/arangodb-repository-output-port'
import GATEWAYS from '../ioc/ioc-symbols-gateway'
import type EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port'
import { Database } from 'arangojs'
import { BaseDTO } from '@/lib/sdk/dto'

@injectable()
class ArangoDBRepository implements ArangoDBRepositoryOutputPort {
  arangoDB: Database | undefined
  constructor(@inject(GATEWAYS.ENV_CONFIG) private envConfig: EnvConfigGatewayOutputPort) {
    this.arangoDB = undefined
  }

  async connect(useDefaultDatabase: boolean = true): Promise<ArangoDBInitDTO<Database>> {
    if (this.arangoDB) return { status: 'success', arangoDB: this.arangoDB }

    const { URL, PORT, DATABASE, USERNAME, PASSWORD } = this.envConfig.arangoDBConfig()

    try {
      const db = new Database({
        url: `${URL}:${PORT}`,
        databaseName: useDefaultDatabase ? DATABASE : undefined,
        auth: { username: USERNAME, password: PASSWORD },
      })
      this.arangoDB = db
      return { status: 'success', arangoDB: db }
    } catch (error: any) {
      return { status: 'error', errorMessage: error.message }
    }
  }

  async createDatabase(databaseName?: string | undefined): Promise<BaseDTO> {
    try {
      if (!databaseName) databaseName = this.envConfig.arangoDBConfig().DATABASE
    } catch (error: any) {
      return { status: 'error', errorType: error.name, errorMessage: error.message }
    }

    let arangoDB = this.arangoDB
    // connect to ArangoDB if not already connected
    try {
      if (!arangoDB) {
        const arangoInitDTO = await this.connect()
        if (arangoInitDTO.status === 'error') return { status: 'error', errorMessage: arangoInitDTO.errorMessage }
        if (!arangoInitDTO.arangoDB) return { status: 'error', errorMessage: 'ArangoDB is not initialized' }
        arangoDB = arangoInitDTO.arangoDB
      }
    } catch (error: any) {
      return { status: 'error', errorType: error.name, errorMessage: error.message }
    }

    // check if database already exists, create if not
    try {
      const result = await arangoDB.listDatabases()
      if (result.includes(databaseName)) return { status: 'success' }
      await arangoDB.createDatabase(databaseName)
      return { status: 'success' }
    } catch (error: any) {
      return { status: 'error', errorType: 'Arango Error', errorMessage: `Failed to create ${databaseName}. ${error.message}` }
    }
  }
}

export default ArangoDBRepository
