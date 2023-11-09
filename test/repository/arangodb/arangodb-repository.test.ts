import { ArangoDBInitDTO } from '@/lib/core/dto/arangodb-dto'
import ArangoDBRepositoryOutputPort from '@/lib/core/port/secondary/arangodb-repository-output-port'
import appContainer from '@/lib/infrastructure/ioc/container-config'
import REPOSITORY from '@/lib/infrastructure/ioc/ioc-symbols-repository'
import { Database } from 'arangojs'

describe('ArangoDB Repository Tests', () => {
  it('should be able to connect to ArangoDB', async () => {
    const arangoDBRepository = appContainer.get<ArangoDBRepositoryOutputPort>(REPOSITORY.ARANGODB)
    const arangoInitDTO: ArangoDBInitDTO<Database> = await arangoDBRepository.connect()
    expect(arangoInitDTO.status).toBe('success')
    expect(arangoInitDTO.arangoDB).toBeInstanceOf(Database)
  })
})
