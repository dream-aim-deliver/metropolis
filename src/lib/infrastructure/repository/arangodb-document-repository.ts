import ArangoDBDocumentRepositoryOutputPort from "@/lib/core/port/secondary/arandogb-document-repository-output-port";
import { inject, injectable } from "inversify";
import REPOSITORY from "../ioc/ioc-symbols-repository";
import type ArangoDBRepositoryOutputPort from "@/lib/core/port/secondary/arangodb-repository-output-port";
import { Database } from "arangojs/database";
import { ArangoDBdocumentDTO } from "@/lib/core/dto/arangodb-dto";
import { ArangoCollection, DocumentCollection, EdgeCollection } from "arangojs/collection";
import { EdgeData } from "arangojs/documents";

@injectable()
class ArangoDBDocumentRepository implements ArangoDBDocumentRepositoryOutputPort {
    arangoDB: Database | undefined
    constructor(
        @inject(REPOSITORY.ARANGODB) private arangoDBRepository: ArangoDBRepositoryOutputPort
    ) { }

    async initialize(): Promise<Database | undefined> {
        if (this.arangoDB) return this.arangoDB
        const arangoConnectDTO = await this.arangoDBRepository.connect(true)
        if (arangoConnectDTO.status === 'error') return
        if (!arangoConnectDTO.arangoDB) return
        return arangoConnectDTO.arangoDB

    }

    async createDocument<TDocument extends Record<string, any> | EdgeData>(collectionName: string, document: TDocument): Promise<ArangoDBdocumentDTO<TDocument>> {
        if (!this.arangoDB) {
            this.arangoDB = await this.initialize()
        }
        const arangoDB = this.arangoDB

        let collection: DocumentCollection | EdgeCollection | undefined = undefined

        // check if collection already exists, create if not
        try {
            const result = await arangoDB?.listCollections()
            if (!result) return { status: 'error', errorType: 'Arango Error', errorMessage: `Failed to list existing Collections in ArangoDB. ${result}` }

            for (const col of result) {
                if (col.name === collectionName) {
                    collection = this.arangoDB?.collection(collectionName)
                }
            }

            if (!collection) {
                return { status: 'error', errorType: 'Arango Error', errorMessage: `Collection ${collectionName} does not exist. Please create it before adding documents.` }
            }
            const doc = await collection.save(document)
            return { status: 'success', document: document }
        } catch (error: any) {
            return { status: 'error', errorType: 'Arango Error', errorMessage: `Failed to create Document in ${collectionName}. ${error.message}` }
        }
    }
}

export default ArangoDBDocumentRepository