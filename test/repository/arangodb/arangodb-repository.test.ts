import ArangoDBRepositoryOutputPort from '@/lib/core/port/secondary/arangodb-repository-output-port'
import appContainer from '@/lib/infrastructure/ioc/container-config'
import REPOSITORY from '@/lib/infrastructure/ioc/ioc-symbols-repository'

describe('ArangoDB Repository Tests', () => {
  it('should be able to connect to ArangoDB', async () => {
    const arangoDBDTO = appContainer.get<ArangoDBRepositoryOutputPort>(REPOSITORY.ARANGODB)
    await arangoDBDTO.connect()
  })
})
