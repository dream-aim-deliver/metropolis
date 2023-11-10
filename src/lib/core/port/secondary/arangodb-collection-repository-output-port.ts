import { BaseDTO } from "@/lib/sdk/dto";

export default interface ArangoDBCollectionRepositoryOutputPort {
    /**
     * Creates a new collection in ArangoDB if it does not already exist
     * @param collectionName The name of the collection to create
     * @returns A promise that resolves to a ${@link BaseDTO} object
     */
    createCollection(collectionName: string): Promise<BaseDTO>
}