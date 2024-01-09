import { genUniqName } from '@/lib/common/utils'
import { ArangoDBCollectionDTO } from '@/lib/core/dto/arangodb-dto'
import ArangoDBCollectionRepositoryOutputPort from '@/lib/core/port/secondary/arangodb-collection-repository-output-port'
import ArangoDBRepositoryOutputPort from '@/lib/core/port/secondary/arangodb-repository-output-port'
import appContainer from '@/lib/infrastructure/ioc/container-config'
import REPOSITORY from '@/lib/infrastructure/ioc/ioc-symbols-repository'
import { Database } from 'arangojs'
import { DocumentCollection, EdgeCollection } from 'arangojs/collection'

interface TDocument {
  _key: string
  _id: string
  _rev: string
  name: string
}

interface TEdge {
  _key: string
  _id: string
  _rev: string
  _from: string
  _to: string
}

const dbName = genUniqName('testDB-Collection-Repository')

describe('ArangoDB Collection Repository Tests', () => {
  beforeAll(async () => {
    const arangoDBRepository = appContainer.get<ArangoDBRepositoryOutputPort<Database>>(REPOSITORY.ARANGODB)
    const connectionDTO = await arangoDBRepository.useOrCreateDatabase(dbName)
    expect(connectionDTO.status).toBe('success')
  })

  it('should create a new document collection in ArangoDB', async () => {
    // Creation step
    const arangoDBCollectionRepository = appContainer.get<ArangoDBCollectionRepositoryOutputPort>(REPOSITORY.ARANGODB_COLLECTION)

    const testDocumentCollectionName = genUniqName(`testDocumentCollection`)

    const result: ArangoDBCollectionDTO<TDocument, DocumentCollection<TDocument>> = await arangoDBCollectionRepository.createDocumentCollection<TDocument>(
      testDocumentCollectionName,
      dbName,
    )

    // Verification step
    expect(result.status).toBe('success')
    expect(result.collection).toBeDefined()
    if (result.status == 'success' && result.collection) {
      const collection = result.collection
      const collectionExists = await collection.exists()
      expect(collectionExists).toBe(true)
    }

    // Manual verification step
    const arangoDBRepository = appContainer.get<ArangoDBRepositoryOutputPort<Database>>(REPOSITORY.ARANGODB)
    const connectionDTO = await arangoDBRepository.useOrCreateDatabase(dbName)
    expect(connectionDTO.status).toBe('success')

    if (connectionDTO.status === 'success') {
      expect(connectionDTO.arangoDB).toBeDefined()
      if (connectionDTO.arangoDB) {
        const arangoDB = connectionDTO.arangoDB
        const testCollection = arangoDB.collection(testDocumentCollectionName)
        const testCollectionExists = await testCollection.exists()
        expect(testCollectionExists).toBe(true)

        const allCollections = await arangoDB.listCollections()
        expect(allCollections).toBeDefined()
        expect(allCollections?.length).toBeGreaterThan(0)
        expect(allCollections?.map(collection => collection.name)).toContain(testDocumentCollectionName)
      }
    }
  })

  it('should create a new edge collection in ArangoDB', async () => {
    // Creation step
    const arangoDBCollectionRepository = appContainer.get<ArangoDBCollectionRepositoryOutputPort>(REPOSITORY.ARANGODB_COLLECTION)

    const testEdgeCollectionName = genUniqName(`testEdgeCollection`)
    const result: ArangoDBCollectionDTO<TEdge, EdgeCollection<TEdge>> = await arangoDBCollectionRepository.createEdgeCollection<TEdge>(testEdgeCollectionName, dbName)

    // Verification step
    expect(result.status).toBe('success')
    expect(result.collection).toBeDefined()
    if (result.status == 'success' && result.collection) {
      const collection = result.collection
      const collectionExists = await collection.exists()
      expect(collectionExists).toBe(true)
    }

    // Manual verification step
    const arangoDBRepository = appContainer.get<ArangoDBRepositoryOutputPort<Database>>(REPOSITORY.ARANGODB)
    const connectionDTO = await arangoDBRepository.useOrCreateDatabase(dbName)
    expect(connectionDTO.status).toBe('success')

    if (connectionDTO.status === 'success') {
      expect(connectionDTO.arangoDB).toBeDefined()
      if (connectionDTO.arangoDB) {
        const arangoDB = connectionDTO.arangoDB
        const testCollection = arangoDB.collection(testEdgeCollectionName)
        const testCollectionExists = await testCollection.exists()
        expect(testCollectionExists).toBe(true)

        const allCollections = await arangoDB.listCollections()
        expect(allCollections).toBeDefined()
        expect(allCollections?.length).toBeGreaterThan(0)
        expect(allCollections?.map(collection => collection.name)).toContain(testEdgeCollectionName)
      }
    }
  })
  afterAll(async () => {
    const arangoDBRepository = appContainer.get<ArangoDBRepositoryOutputPort<Database>>(REPOSITORY.ARANGODB)
    const connectionDTO = await arangoDBRepository.useOrCreateDatabase(dbName)
    expect(connectionDTO.status).toBe('success')

    if (connectionDTO.status === 'success') {
      expect(connectionDTO.arangoDB).toBeDefined()
      if (connectionDTO.arangoDB) {
        const system_db = connectionDTO.arangoSystemDB

        await system_db.dropDatabase(dbName)
        const dbExists = await system_db.database(dbName).exists()
        expect(dbExists).toBe(false)
      }
    }
  })
})
