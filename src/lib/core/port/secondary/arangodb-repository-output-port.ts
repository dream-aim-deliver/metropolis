import { ArangoDBInitDTO } from '../../dto/arangodb-dto'

export default interface ArangoDBRepository {
  /**
   * Initializes the ArangoDB database connection
   */
  initialize(): Promise<ArangoDBInitDTO>
}
