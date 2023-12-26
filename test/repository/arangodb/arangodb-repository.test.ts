import { ArangoDBConnectionDTO, ArangoDBEnvVariablesDTO } from '@/lib/core/dto/arangodb-dto'
import ArangoDBRepositoryOutputPort from '@/lib/core/port/secondary/arangodb-repository-output-port'
import EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port'
import appContainer from '@/lib/infrastructure/ioc/container-config'
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway'
import REPOSITORY from '@/lib/infrastructure/ioc/ioc-symbols-repository'
import { Database, aql } from 'arangojs'
import { DocumentCollection, EdgeCollection } from 'arangojs/collection'
import { QueryOptions } from 'arangojs/database'

// NOTE: these should be the same as the ones in the .env file that is used for testing
// TODO: provide them like a pytest fixture or something
const testURL = 'http://localhost'
const testPORT = 8530
const testDATABASE = 'metropolis_test'
const testUSERNAME = 'root'
const testPASSWORD = 'thereisnospoon'

describe('ArangoDB Repository Tests', () => {
  it('should give back the environment variables', async () => {
    const arangoDBRepository = appContainer.get<ArangoDBRepositoryOutputPort<Database>>(REPOSITORY.ARANGODB)

    const envVariablesDTO: ArangoDBEnvVariablesDTO = await arangoDBRepository._exportEnvironmentVariables()

    expect(envVariablesDTO.status).toBe('success')
    // Manually match the expected values with the ones in the .env file that is used for testing
    expect(envVariablesDTO.URL).toBe(testURL)
    expect(envVariablesDTO.PORT).toBe(testPORT)
    expect(envVariablesDTO.DATABASE).toBe(testDATABASE)
    expect(envVariablesDTO.USERNAME).toBe(testUSERNAME)
    expect(envVariablesDTO.PASSWORD).toBe(testPASSWORD)
  })

  it("should create a new database in ArangoDB or use it if it doesn't exist", async () => {
    const arangoDBRepository = appContainer.get<ArangoDBRepositoryOutputPort<Database>>(REPOSITORY.ARANGODB)

    const result = await arangoDBRepository.useOrCreateDatabase()
    expect(result.status).toBe('success')

    if (result.status === 'success') {
      expect(result.arangoDB).toBeDefined()
      let db: Database
      let dbExists: boolean
      db = result.arangoDB
      dbExists = await db.exists()
      expect(dbExists).toBe(true)

      const result2 = await arangoDBRepository.useOrCreateDatabase()
      expect(result2.status).toBe('success')
      if (result2.status === 'success') {
        expect(result2.arangoDB).toBeDefined()
        db = result2.arangoDB
        dbExists = await db.exists()
        expect(dbExists).toBe(true)
      }
    }
  })

  it('should delete *all* preexisting collections in a given Arango database and create new empty ones ', async () => {
    const arangoDBRepository = appContainer.get<ArangoDBRepositoryOutputPort<Database>>(REPOSITORY.ARANGODB)

    const connectionDTO = await arangoDBRepository.useOrCreateDatabase()
    expect(connectionDTO.status).toBe('success')
    if (connectionDTO.status === 'success') {
      expect(connectionDTO.arangoSystemDB).toBeDefined()
      if (connectionDTO.arangoSystemDB) {
        const system_db = connectionDTO.arangoSystemDB

        // TODO: once we have a fixture for env variables, we can use the ones from there instead of this
        const envVariablesDTO: ArangoDBEnvVariablesDTO = await arangoDBRepository._exportEnvironmentVariables()
        expect(envVariablesDTO.status).toBe('success')
        expect(envVariablesDTO.DATABASE).toBe(testDATABASE)
        if (envVariablesDTO.status === 'success' && envVariablesDTO.DATABASE) {
          const dbName = envVariablesDTO.DATABASE

          const repristineDTO = await arangoDBRepository._repristineDataBase(dbName)

          // Verification step
          expect(repristineDTO.status).toBe('success')

          // Manual verification step
          const db = system_db.database(dbName)
          const dbExists = await db.exists()
          expect(dbExists).toBe(true)

          const collections = await db.collections()
          expect(collections).toBeDefined()
          expect(collections).not.toBe(0)

          const queryOpts: QueryOptions = { count: true }

          for (let collection of collections) {
            const cursor = await db.query(
              aql`
                    FOR doc IN ${collection}
                    RETURN doc
                `,
              queryOpts,
            )
            expect(cursor).toBeDefined()
            expect(cursor.count).toBe(0)
          }
        }
      }
    }
  })
})
