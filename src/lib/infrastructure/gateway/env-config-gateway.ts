import { ConfigNotFound, InvalidConfig } from '@/lib/core/exceptions/env-config-exceptions'
import EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port'
import { injectable } from 'inversify'

@injectable()
class EnvConfigGateway implements EnvConfigGatewayOutputPort {
  arangoDBConfig(): { URL: string; PORT: number; DATABASE: string; USERNAME: string; PASSWORD: string } {
    const url = this.get('arango_url', true)
    const database = this.get('arango_database', true)
    const port = parseInt(this.get('arango_port', true) || '8529')
    const username = this.get('arango_user', true)
    const password = this.get('arangodb_password', true)
    if (!url || !port || !database || !username || !password) throw new InvalidConfig('ArangoDB configuration is invalid')
    return { URL: url, PORT: port, DATABASE: database, USERNAME: username, PASSWORD: password }
  }

  get(key: string, required: boolean = false): string | undefined {
    let value = process.env[key]
    if (value !== undefined) {
      return value
    }
    value = process.env[key.toUpperCase()]
    if (value !== undefined) {
      return value
    }
    value = process.env[key.toLowerCase()]
    if (value !== undefined) {
      return value
    }
    if (required) {
      throw new ConfigNotFound(key)
    }
    return undefined
  }
}

export default EnvConfigGateway
