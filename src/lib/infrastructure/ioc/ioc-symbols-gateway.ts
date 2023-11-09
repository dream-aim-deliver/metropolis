/**
 * This file contains the symbols used to register the gateways in the IoC container.
 */
const GATEWAYS = {
  ARANGODB: Symbol.for('ArangoDBGateway'),
  ENV_CONFIG: Symbol.for('EnvConfigGateway'),
  STREAM: Symbol.for('StreamGateway'),
}

export default GATEWAYS
