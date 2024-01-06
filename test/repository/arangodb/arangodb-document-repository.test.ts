import { ArangoDBdocumentDTO } from '@/lib/core/dto/arangodb-dto'
import ArangoDBDocumentRepositoryOutputPort from '@/lib/core/port/secondary/arangogb-document-repository-output-port'
import ArangoDBCollectionRepositoryOutputPort from '@/lib/core/port/secondary/arangodb-collection-repository-output-port'
import ArangoDBRepositoryOutputPort from '@/lib/core/port/secondary/arangodb-repository-output-port'
import appContainer from '@/lib/infrastructure/ioc/container-config'
import REPOSITORY from '@/lib/infrastructure/ioc/ioc-symbols-repository'
import { Database, aql } from 'arangojs'
import { QueryOptions } from 'arangojs/database'
import { DocumentMetadata } from 'arangojs/documents'

interface TDocument {
  name: string
}

const testCollectionName = `testCollection-at-${Date.now()}`

describe('ArangoDB Document Repository Tests', () => {
  beforeAll(async () => {
    const arangoDBRepository = appContainer.get<ArangoDBRepositoryOutputPort<Database>>(REPOSITORY.ARANGODB)
    const db = await arangoDBRepository.useOrCreateDatabase()
    expect(db.status).toBe('success')

    const arangoDBCollectionRepository = appContainer.get<ArangoDBCollectionRepositoryOutputPort>(REPOSITORY.ARANGODB_COLLECTION)
    const collectionResultDTO: ArangoDBdocumentDTO<TDocument> = await arangoDBCollectionRepository.createDocumentCollection<TDocument>(testCollectionName)
    expect(collectionResultDTO.status).toBe('success')
  })

  it('should create a new document in a collection in ArangoDB', async () => {
    // Creation step
    const arangoDBDocumentRepository = appContainer.get<ArangoDBDocumentRepositoryOutputPort>(REPOSITORY.ARANGODB_DOCUMENT)

    const testDocument = { name: 'testDocument' }

    const result: ArangoDBdocumentDTO<DocumentMetadata> = await arangoDBDocumentRepository.createDocument<TDocument>(testCollectionName, testDocument)

    // Verification step
    expect(result.status).toBe('success')
    expect(result.document).toBeDefined()

    // Manual verification step
    const arangoDBRepository = appContainer.get<ArangoDBRepositoryOutputPort<Database>>(REPOSITORY.ARANGODB)
    const connectionDTO = await arangoDBRepository.useOrCreateDatabase()
    expect(connectionDTO.status).toBe('success')

    if (connectionDTO.status === 'success') {
      expect(connectionDTO.arangoDB).toBeDefined()
      if (connectionDTO.arangoDB) {
        const arangoDB = connectionDTO.arangoDB
        const testCollection = arangoDB.collection(testCollectionName)
        const testCollectionExists = await testCollection.exists()
        expect(testCollectionExists).toBe(true)

        /* fuckers at arangojs have deprecated the .all() method, saying that:
            "simple queries have been deprecated ... and can be replaced with AQL queries"
            Luis: the whole point of using their confusing arangojs shit is to NOT use AQL -_-   See:  https://arangodb.github.io/arangojs/8.6.0/interfaces/collection.DocumentCollection.html#all
            */
        //const cursor = await arangoDB.collection('testCollection').all()
        const queryOpts: QueryOptions = { count: true } // this needs to be passed, otherwise cursor.count doesn't work, what a PITA this shit is
        const cursor = await arangoDB.query(
          aql`
                FOR doc IN ${testCollection}
                RETURN doc
            `,
          queryOpts,
        )

        expect(cursor).toBeDefined()
        expect(cursor.count).toBeGreaterThan(0)
        const documents = await cursor.all()
        expect(documents).toBeDefined()
        expect(documents?.length).toBeGreaterThan(0)
        expect(documents?.map(document => document.name)).toContain('testDocument')
      }
    }
  })

  // TODO
  it('should create all of the test documents passed in a collection in ArangoDB', async () => {
    // Creation step

    const arangoDBDocumentRepository = appContainer.get<ArangoDBDocumentRepositoryOutputPort>(REPOSITORY.ARANGODB_DOCUMENT)

    const testDocument = { name: 'testDocument' }

    const result: ArangoDBdocumentDTO<DocumentMetadata> = await arangoDBDocumentRepository.createDocuments<TDocument>(testCollectionName, [testDocument])
    expect(result.status).toBe('success')
  })
})
