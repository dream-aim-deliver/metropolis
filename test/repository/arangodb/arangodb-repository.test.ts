import { ArangoDBConnectionDTO } from '@/lib/core/dto/arangodb-dto'
import ArangoDBRepositoryOutputPort from '@/lib/core/port/secondary/arangodb-repository-output-port'
import EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port'
import appContainer from '@/lib/infrastructure/ioc/container-config'
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway'
import REPOSITORY from '@/lib/infrastructure/ioc/ioc-symbols-repository'
import { Database } from 'arangojs'

describe('ArangoDB Repository Tests', () => {

  it('should create a new database in ArangoDB', async () => {
    const arangoDBRepository = appContainer.get<ArangoDBRepositoryOutputPort>(REPOSITORY.ARANGODB)
    const result = await arangoDBRepository.useOrCreateDatabase()
    expect(result.status).toBe('success')

    const result2 = await arangoDBRepository.useOrCreateDatabase()
    expect(result2.status).toBe('success')
  })
})
