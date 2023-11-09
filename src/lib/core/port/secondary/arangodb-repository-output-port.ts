import { ArangoDBInitDTO } from '../../dto/arangodb-dto'

export default interface ArangoDBRepositoryOutputPort {
  /**
   * Initializes the ArangoDB database connection
   */
  initialize(): Promise<ArangoDBInitDTO>
}
