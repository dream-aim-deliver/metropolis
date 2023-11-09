import {
  ConfigNotFound,
  InvalidConfig,
} from '@/lib/core/exceptions/env-config-exceptions'
import EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port'
import { injectable } from 'inversify'

@injectable()
class EnvConfigGateway implements EnvConfigGatewayOutputPort {
  async get(
    key: string,
    required: boolean = false,
  ): Promise<string | undefined> {
    let value = process.env[key]
    if (value !== undefined) {
      return Promise.resolve(value)
    }
    value = process.env[key.toUpperCase()]
    if (value !== undefined) {
      return Promise.resolve(value)
    }
    value = process.env[key.toLowerCase()]
    if (value !== undefined) {
      return Promise.resolve(value)
    }
    if (required) {
      throw new ConfigNotFound(key)
    }
    return Promise.resolve(undefined)
  }
}

export default EnvConfigGateway
