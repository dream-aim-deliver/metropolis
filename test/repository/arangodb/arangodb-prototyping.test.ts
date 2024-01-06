import ArangoDBRepositoryOutputPort from '@/lib/core/port/secondary/arangodb-repository-output-port'
import appContainer from '@/lib/infrastructure/ioc/container-config'
import REPOSITORY from '@/lib/infrastructure/ioc/ioc-symbols-repository'
import { Database } from 'arangojs'

interface TDocument {
  name: string
}

const timestamp = Date.now()
const dbName = `testDB-${timestamp}`

describe('ArangoDB prototyping and scripting', () => {
  beforeAll(async () => {})
  it('Check if databases can be created and dropped ad hoc', async () => {
    // DB Initialization step
    const arangoDBRepository = appContainer.get<ArangoDBRepositoryOutputPort<Database>>(REPOSITORY.ARANGODB)
    const connectionDTO = await arangoDBRepository.useOrCreateDatabase(dbName)
    expect(connectionDTO.status).toBe('success')
    expect(connectionDTO).toBeDefined()
    if (connectionDTO.status === 'success' && connectionDTO.arangoSystemDB) {
      expect(connectionDTO.arangoSystemDB).toBeDefined()
      const system_db = connectionDTO.arangoSystemDB

      // Scripting step
      let dbExists: boolean

      dbExists = await system_db.database(dbName).exists()
      expect(dbExists).toBe(true)

      await system_db.dropDatabase(dbName)
      dbExists = await system_db.database(dbName).exists()
      expect(dbExists).toBe(false)
    }
  })
})
