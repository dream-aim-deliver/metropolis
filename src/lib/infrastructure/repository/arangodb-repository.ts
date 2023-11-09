import { inject, injectable } from 'inversify'
import { ArangoDBInitDTO } from '@/lib/core/dto/arangodb-dto'
import ArangoDBRepositoryOutputPort from '@/lib/core/port/secondary/arangodb-repository-output-port'
import GATEWAYS from '../ioc/ioc-symbols-gateway'
import type EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port'
import { Database } from 'arangojs'

@injectable()
class ArangoDBRepository implements ArangoDBRepositoryOutputPort {
  db: Database | undefined
  constructor(@inject(GATEWAYS.ENV_CONFIG) private envConfig: EnvConfigGatewayOutputPort) {
    this.db = undefined
  }
  async connect(): Promise<ArangoDBInitDTO<Database>> {
    if (this.db) return { status: 'success', arangoDB: this.db }

    const { URL, PORT, DATABASE, USERNAME, PASSWORD } = this.envConfig.arangoDBConfig()
    try {
      const db = new Database({
        url: `${URL}:${PORT}`,
        databaseName: DATABASE,
        auth: { username: USERNAME, password: PASSWORD },
      })
      this.db = db
      return { status: 'success', arangoDB: db }
    } catch (error: any) {
      return { status: 'error', errorMessage: error.message }
    }
  }
}

export default ArangoDBRepository
