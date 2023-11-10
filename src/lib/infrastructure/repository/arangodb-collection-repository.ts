import ArangoDBCollectionRepositoryOutputPort from "@/lib/core/port/secondary/arangodb-collection-repository-output-port";
import type ArangoDBRepositoryOutputPort from "@/lib/core/port/secondary/arangodb-repository-output-port";
import { inject, injectable } from "inversify";
import REPOSITORY from "../ioc/ioc-symbols-repository";
import { BaseDTO } from "@/lib/sdk/dto";
import type { ArangoDBInitDTO } from "@/lib/core/dto/arangodb-dto";
import { Database } from "arangojs";

@injectable()
class ArangoDBCollectionRepository implements ArangoDBCollectionRepositoryOutputPort {
    constructor(
        @inject(REPOSITORY.ARANGODB) private arangoDBRepository: ArangoDBRepositoryOutputPort
    ) {
    }
    async createCollection(collectionName: string): Promise<BaseDTO> {
        // connect to ArangoDB if not already connected
        const arangoDBConnectionDTO: ArangoDBInitDTO<Database> = await this.arangoDBRepository.connect(true)
        if (arangoDBConnectionDTO.status == 'error') return { status: 'error', errorMessage: arangoDBConnectionDTO.errorMessage }

        const arangoDB = arangoDBConnectionDTO.arangoDB
        if (!arangoDB) return { status: 'error', errorMessage: 'ArangoDB is not initialized' }

        // check if collection already exists, create if not
        try {
            const result = await arangoDB.listCollections()
            for (const collection of result) {
                if (collection.name === collectionName) return { status: 'success' }
            }
            await arangoDB.createCollection(collectionName)
            return { status: 'success' }
        } catch (error: any) {
            return { status: 'error', errorType: 'Arango Error', errorMessage: `Failed to create ${collectionName}. ${error.message}` }
        }
    }
}

export default ArangoDBCollectionRepository