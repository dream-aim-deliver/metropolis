import { ArangoDBdocumentDTO } from "@/lib/core/dto/arangodb-dto"
import ArangoDBDocumentRepositoryOutputPort from "@/lib/core/port/secondary/arandogb-document-repository-output-port"
import ArangoDBCollectionRepositoryOutputPort from "@/lib/core/port/secondary/arangodb-collection-repository-output-port"
import ArangoDBRepositoryOutputPort from "@/lib/core/port/secondary/arangodb-repository-output-port"
import appContainer from "@/lib/infrastructure/ioc/container-config"
import REPOSITORY from "@/lib/infrastructure/ioc/ioc-symbols-repository"

interface TDocument {
    name: string
}

describe('ArangoDB Document Repository Tests', () => {
    beforeAll(async () => {
        const arangoDBRepository = appContainer.get<ArangoDBRepositoryOutputPort>(REPOSITORY.ARANGODB)
        const db = await arangoDBRepository.connect(true)
        expect(db.status).toBe('success')
        expect(db.arangoDB).toBeDefined()

        const arangoDBCollectionRepository = appContainer.get<ArangoDBCollectionRepositoryOutputPort>(REPOSITORY.ARANGODB_COLLECTION)
        const collectionResultDTO: ArangoDBdocumentDTO<TDocument> = await arangoDBCollectionRepository.createDocumentCollection<TDocument>('testCollection')
        expect(collectionResultDTO.status).toBe('success')

    })
    it('should create a new document in a collection in ArangoDB', async () => {
        const arangoDBDocumentRepository = appContainer.get<ArangoDBDocumentRepositoryOutputPort>(REPOSITORY.ARANGODB_DOCUMENT)
        const result: ArangoDBdocumentDTO<TDocument> = await arangoDBDocumentRepository.createDocument<TDocument>('testCollection', { name: 'testDocument' })
        expect(result.status).toBe('success')
        expect(result.document).toBeDefined()


        const arangoDBRepository = appContainer.get<ArangoDBRepositoryOutputPort>(REPOSITORY.ARANGODB)
        const db = await arangoDBRepository.connect(true)
        expect(db.status).toBe('success')
        expect(db.arangoDB).toBeDefined()
        const arangoDB = db.arangoDB
        const collectionList = await arangoDB?.listCollections()
        expect(collectionList).toBeDefined()
        expect(collectionList?.length).toBeGreaterThan(0)
        expect(collectionList?.map(collection => collection.name)).toContain('testCollection')

        const cursor = await arangoDB?.collection('testCollection').all()
        expect(cursor).toBeDefined()
        expect(cursor?.count).toBeGreaterThan(0)
        const documents = await cursor?.all()
        expect(documents).toBeDefined()
        expect(documents?.length).toBeGreaterThan(0)
        expect(documents?.map(document => document.name)).toContain('testDocument')
    })
})