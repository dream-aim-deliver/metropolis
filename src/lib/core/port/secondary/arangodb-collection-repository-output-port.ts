import { BaseDTO } from "@/lib/sdk/dto";
import { ArangoDBCollectionDTO } from "../../dto/arangodb-dto";

export default interface ArangoDBCollectionRepositoryOutputPort {
    /**
     * Creates a new collection in ArangoDB if it does not already exist
     * @param collectionName The name of the collection to create
     * @typeparam T The type of the collection
     * @returns A promise that resolves to a ${@link BaseDTO} object
     */
    createDocumentCollection<TDocument extends Record<string, any>>(collectionName: string): Promise<ArangoDBCollectionDTO<TDocument, any>>

    /**
     * Creates a new edge collection in ArangoDB if it does not already exist
     * @param collectionName The name of the edge collection to create
     * @typeparam TEdge The type of the edge collection
     * @returns A promise that resolves to a ${@link BaseDTO} object
     */
    createEdgeCollection<TEdge extends Record<string, any>>(collectionName: string): Promise<ArangoDBCollectionDTO<TEdge, any>>
}