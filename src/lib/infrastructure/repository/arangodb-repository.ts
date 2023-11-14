import { inject, injectable } from 'inversify'
import { ArangoDBConnectionDTO as ArangoDBConnectionDTO } from '@/lib/core/dto/arangodb-dto'
import ArangoDBRepositoryOutputPort from '@/lib/core/port/secondary/arangodb-repository-output-port'
import GATEWAYS from '../ioc/ioc-symbols-gateway'
import type EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port'
import { Database } from 'arangojs'
import { BaseDTO } from '@/lib/sdk/dto'

@injectable()
class ArangoDBRepository implements ArangoDBRepositoryOutputPort {
  constructor(@inject(GATEWAYS.ENV_CONFIG) private envConfig: EnvConfigGatewayOutputPort) { }

  async use(): Promise<ArangoDBConnectionDTO<Database>> {
    const { URL, PORT, DATABASE, USERNAME, PASSWORD } = this.envConfig.arangoDBConfig()

    try {
      const db = new Database({
        url: `${URL}:${PORT}`,
        databaseName: DATABASE,
        auth: { username: USERNAME, password: PASSWORD },
      })
      return { status: 'success', arangoDB: db }
    } catch (error: any) {
      return { status: 'error', errorCode: error.code, errorType: "ArangoDB Repo", errorMessage: error.message }
    }
  }

  async useOrCreateDatabase(): Promise<ArangoDBConnectionDTO<Database>> {
    const { URL, PORT, DATABASE, USERNAME, PASSWORD } = this.envConfig.arangoDBConfig()
    if (!DATABASE) return { status: 'error', errorCode: 500, errorType: "Env Config Gateway", errorMessage: 'No database name provided in environment variables config' }

    try {
      const db = new Database({
        url: `${this.envConfig.arangoDBConfig().URL}:${this.envConfig.arangoDBConfig().PORT}`,
        auth: { username: this.envConfig.arangoDBConfig().USERNAME, password: this.envConfig.arangoDBConfig().PASSWORD },
      })
      try {
        await db.createDatabase(DATABASE)
        return { status: 'success', arangoDB: db }
      } catch {
        return this.use()
      }
    } catch (error: any) {
      return { status: 'error', errorType: error.name, errorCode: error.code, errorMessage: error.message }
    }
  }
}

export default ArangoDBRepository
