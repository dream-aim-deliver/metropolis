import { ArangoDBdocumentDTO } from "../../dto/arangodb-dto";

export default interface ArangoDBDocumentRepositoryOutputPort {
    /**
     * Creates a new document in a collection in ArangoDB
     * @param collectionName The name of the collection where the document will be created
     * @param document The document to be created
     */
    createDocument<TDocument extends Record<string, any>>(collectionName: string, document: TDocument): Promise<ArangoDBdocumentDTO<TDocument>>
}