import { ArangoDBInitDTO } from '@/lib/core/dto/arangodb-dto'
import ArangoDBRepositoryOutputPort from '@/lib/core/port/secondary/arangodb-repository-output-port'
import EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port'
import appContainer from '@/lib/infrastructure/ioc/container-config'
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway'
import REPOSITORY from '@/lib/infrastructure/ioc/ioc-symbols-repository'
import { Database } from 'arangojs'

describe('ArangoDB Repository Tests', () => {
  it('should be able to connect to ArangoDB', async () => {
    const arangoDBRepository = appContainer.get<ArangoDBRepositoryOutputPort>(REPOSITORY.ARANGODB)
    const arangoInitDTO: ArangoDBInitDTO<Database> = await arangoDBRepository.connect(false)
    expect(arangoInitDTO.status).toBe('success')
    expect(arangoInitDTO.arangoDB).toBeInstanceOf(Database)
  })

  it('should create a new database in ArangoDB', async () => {
    const arangoDBRepository = appContainer.get<ArangoDBRepositoryOutputPort>(REPOSITORY.ARANGODB)
    const envConfigGateway = appContainer.get<EnvConfigGatewayOutputPort>(GATEWAYS.ENV_CONFIG)

    const { DATABASE } = envConfigGateway.arangoDBConfig()
    const arangoInitDTO = await arangoDBRepository.connect(false)
    expect(arangoInitDTO.status).toBe('success')
    expect(arangoInitDTO.arangoDB).toBeInstanceOf(Database)
    const db = arangoInitDTO.arangoDB

    const result = await arangoDBRepository.createDatabase()
    expect(result.status).toBe('success')

    const databaseList = await db.listDatabases()
    expect(databaseList).toContain(DATABASE)
  })
})
