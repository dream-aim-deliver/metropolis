import { genUniqName } from '@/lib/common/utils'
import { ArangoDBConnectionDTO } from '@/lib/core/dto/arangodb-dto'
import ArangoDBRepositoryOutputPort from '@/lib/core/port/secondary/arangodb-repository-output-port'
import EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port'
import appContainer from '@/lib/infrastructure/ioc/container-config'
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway'
import REPOSITORY from '@/lib/infrastructure/ioc/ioc-symbols-repository'
import { Database, aql } from 'arangojs'
import { DocumentCollection, EdgeCollection } from 'arangojs/collection'
import { QueryOptions } from 'arangojs/database'

const dbName1 = genUniqName('testDB-Repository')
const dbName2 = genUniqName('testDB-Repository')
const dbName3 = genUniqName('testDB-Repository')

describe('ArangoDB Repository Tests', () => {
  it("should create a new database in ArangoDB or use it if it doesn't exist", async () => {
    const arangoDBRepository = appContainer.get<ArangoDBRepositoryOutputPort<Database>>(REPOSITORY.ARANGODB)

    const result = await arangoDBRepository.useOrCreateDatabase(dbName1)
    expect(result.status).toBe('success')

    if (result.status === 'success') {
      expect(result.arangoDB).toBeDefined()
      let db: Database
      let dbExists: boolean
      db = result.arangoDB
      dbExists = await db.exists()
      expect(dbExists).toBe(true)

      const result2 = await arangoDBRepository.useOrCreateDatabase(dbName2)
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

    const connectionDTO = await arangoDBRepository.useOrCreateDatabase(dbName3)
    expect(connectionDTO.status).toBe('success')
    if (connectionDTO.status === 'success') {
      expect(connectionDTO.arangoDB).toBeDefined()
      if (connectionDTO.arangoDB) {
        const db = connectionDTO.arangoDB

        for (let i = 0; i < 5; i++) {
          await db.createCollection(`testCollection${i}`)
          const collection = db.collection(`testCollection${i}`)
          const colExists = await collection.exists()
          expect(colExists).toBe(true)

          const documents = Array.from({ length: 5 }, (_, i) => ({ name: `testDocument${i + 1}` }))

          await collection.saveAll(documents)
        }

        const repristineDTO = await arangoDBRepository._repristineDataBase(dbName3)

        // Verification step
        expect(repristineDTO.status).toBe('success')

        // Manual verification step
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
  })

  afterAll(async () => {
    const arangoDBRepository = appContainer.get<ArangoDBRepositoryOutputPort<Database>>(REPOSITORY.ARANGODB)
    const connectionDTO = await arangoDBRepository.useOrCreateDatabase(dbName1)
    expect(connectionDTO.status).toBe('success')

    if (connectionDTO.status === 'success') {
      expect(connectionDTO.arangoDB).toBeDefined()
      if (connectionDTO.arangoDB) {
        const system_db = connectionDTO.arangoSystemDB

        await system_db.dropDatabase(dbName1)
        const dbExists1 = await system_db.database(dbName1).exists()

        await system_db.dropDatabase(dbName2)
        const dbExists2 = await system_db.database(dbName2).exists()

        await system_db.dropDatabase(dbName3)
        const dbExists3 = await system_db.database(dbName3).exists()

        expect(dbExists1).toBe(false)
        expect(dbExists2).toBe(false)
        expect(dbExists3).toBe(false)
      }
    }
  })
})
