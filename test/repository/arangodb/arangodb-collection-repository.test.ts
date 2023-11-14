import { ArangoDBCollectionDTO } from "@/lib/core/dto/arangodb-dto"
import ArangoDBCollectionRepositoryOutputPort from "@/lib/core/port/secondary/arangodb-collection-repository-output-port"
import appContainer from "@/lib/infrastructure/ioc/container-config"
import REPOSITORY from "@/lib/infrastructure/ioc/ioc-symbols-repository"
import ArangoDBRepository from "@/lib/infrastructure/repository/arangodb-repository"
import { DocumentCollection } from "arangojs/collection"

interface TDocument {
    _key: string
    _id: string
    _rev: string
    name: string

}

describe('ArangoDB Collection Repository Tests', () => {
    beforeAll(async () => {
        // const arangoDBRepository = appContainer.get<ArangoDBRepository>(REPOSITORY.ARANGODB)
        // await arangoDBRepository.createDatabase()

    })
    it('should create a new document collection in ArangoDB', async () => {
        // const arangoDBCollectionRepository = appContainer.get<ArangoDBCollectionRepositoryOutputPort>(REPOSITORY.ARANGODB_COLLECTION)
        // const result: ArangoDBCollectionDTO<TDocument, DocumentCollection<TDocument>> = await arangoDBCollectionRepository.createDocumentCollection<TDocument>('testCollection')
        // console.log(result)
        // expect(result.status).toBe('success')
        // expect(result.collection).toBeDefined()

        // const arangoDBRepository = appContainer.get<ArangoDBRepository>(REPOSITORY.ARANGODB)
        // await arangoDBRepository.createDatabase()
        // const db = await arangoDBRepository.use()
        // expect(db.status).toBe('success')
        // expect(db.arangoDB).toBeDefined()

        // const arangoDB = db.arangoDB
        // const collectionList = await arangoDB?.listCollections()
        // expect(collectionList).toBeDefined()
        // expect(collectionList?.length).toBeGreaterThan(0)
        // expect(collectionList?.map(collection => collection.name)).toContain('testCollection')

    })

    it('should create a new edge collection in ArangoDB', async () => {
        // const arangoDBCollectionRepository = appContainer.get<ArangoDBCollectionRepositoryOutputPort>(REPOSITORY.ARANGODB_COLLECTION)
        // const result: ArangoDBCollectionDTO<TDocument, DocumentCollection<TDocument>> = await arangoDBCollectionRepository.createEdgeCollection<TDocument>('testEdgeCollection')
        // expect(result.status).toBe('success')
        // expect(result.collection).toBeDefined()

        // const arangoDBRepository = appContainer.get<ArangoDBRepository>(REPOSITORY.ARANGODB)
        // const db = await arangoDBRepository.use()
        // expect(db.status).toBe('success')
        // expect(db.arangoDB).toBeDefined()

        // const arangoDB = db.arangoDB
        // const collectionList = await arangoDB?.listCollections()
        // expect(collectionList).toBeDefined()
        // expect(collectionList?.length).toBeGreaterThan(0)
        // expect(collectionList?.map(collection => collection.name)).toContain('testEdgeCollection')

    })
})