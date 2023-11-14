import ArangoDBCollectionRepositoryOutputPort from "@/lib/core/port/secondary/arangodb-collection-repository-output-port";
import type ArangoDBRepositoryOutputPort from "@/lib/core/port/secondary/arangodb-repository-output-port";
import { inject, injectable } from "inversify";
import REPOSITORY from "../ioc/ioc-symbols-repository";
import type { ArangoDBCollectionDTO, ArangoDBConnectionDTO } from "@/lib/core/dto/arangodb-dto";
import { Database } from "arangojs";
import { DocumentCollection, EdgeCollection } from "arangojs/collection";

@injectable()
class ArangoDBCollectionRepository implements ArangoDBCollectionRepositoryOutputPort {
    arangoDB: Database | undefined
    constructor(
        @inject(REPOSITORY.ARANGODB) private arangoDBRepository: ArangoDBRepositoryOutputPort
    ) {
        this.arangoDBRepository.use(true).then((arangoDBConnectionDTO: ArangoDBConnectionDTO<Database>) => {
            if (arangoDBConnectionDTO.status == 'error')
                return { status: 'error', errorMessage: arangoDBConnectionDTO.errorMessage }
            const arangoDB = arangoDBConnectionDTO.arangoDB
            if (!arangoDB) return { status: 'error', errorMessage: 'ArangoDB is not initialized' }
            this.arangoDB = arangoDB
        })
    }

    async initialize(): Promise<Database | undefined> {
        if (this.arangoDB) return this.arangoDB
        const arangoConnectDTO: ArangoDBConnectionDTO<Database> = await this.arangoDBRepository.use(true)
        if (arangoConnectDTO.status === 'error') return
        if (!arangoConnectDTO.arangoDB) return
        return arangoConnectDTO.arangoDB

    }
    async createDocumentCollection<TDocument extends Record<string, any>>(collectionName: string): Promise<ArangoDBCollectionDTO<TDocument, DocumentCollection<TDocument>>> {
        if (!this.arangoDB) {
            this.arangoDB = await this.initialize()
        }
        const arangoDB = this.arangoDB
        // check if collection already exists, create if not
        try {
            const result = await arangoDB?.listCollections()
            if (!result) return { status: 'error', errorType: 'Arango Error', errorMessage: `Failed to list existing Collections in ArangoDB. ${result}` }

            for (const collection of result) {
                if (collection.name === collectionName) {
                    const documentCollection = this.arangoDB?.collection<TDocument>(collectionName)
                    return {
                        status: 'success',
                        collection: documentCollection
                    }
                }
            }
            const documentCollection: DocumentCollection<TDocument> | undefined = await arangoDB?.createCollection<TDocument>(collectionName)
            if (!documentCollection) return { status: 'error', errorType: 'Arango Error', errorMessage: `Failed to create ${collectionName}. ${documentCollection}` }
            return { status: 'success', collection: documentCollection }
        } catch (error: any) {
            return { status: 'error', errorType: 'Arango Error', errorMessage: `Failed to create ${collectionName}. ${error.message}` }
        }
    }
    async createEdgeCollection<TEdge extends Record<string, any>>(collectionName: string): Promise<ArangoDBCollectionDTO<TEdge, EdgeCollection<TEdge>>> {
        if (!this.arangoDB) {
            this.arangoDB = await this.initialize()
        }
        const arangoDB = this.arangoDB
        // check if collection already exists, create if not
        try {
            const result = await arangoDB?.listCollections()
            if (!result) return { status: 'error', errorType: 'Arango Error', errorMessage: `Failed to list existing Collections in ArangoDB. ${result}` }

            for (const collection of result) {
                if (collection.name === collectionName) {
                    const edgeCollection = this.arangoDB?.collection<TEdge>(collectionName)
                    return {
                        status: 'success',
                        collection: edgeCollection
                    }
                }
            }
            const edgeCollection: EdgeCollection<TEdge> | undefined = await arangoDB?.createEdgeCollection<TEdge>(collectionName)
            if (!edgeCollection) return { status: 'error', errorType: 'Arango Error', errorMessage: `Failed to create ${collectionName}. ${edgeCollection}` }
            return { status: 'success', collection: edgeCollection }
        } catch (error: any) {
            return { status: 'error', errorType: 'Arango Error', errorMessage: `Failed to create ${collectionName}. ${error.message}` }
        }
    }
}

export default ArangoDBCollectionRepository