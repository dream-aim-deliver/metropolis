import { InvalidConfig } from '@/lib/core/exceptions/env-config-exceptions'
import EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port'
import { injectable } from 'inversify'

@injectable()
class EnvConfigGateway implements EnvConfigGatewayOutputPort {
  arangoDBConfig(): { URL: string; PORT: number; DATABASE: string; USERNAME: string; PASSWORD: string; ROOT_PASSWORD: string } {
    const conf = {
      ARANGO_URL: this.get('arango_url'),
      ARANGO_PORT_STR: this.get('arango_port'),
      ARANGO_DATABASE: this.get('arango_database'),
      ARANGO_USERNAME: this.get('arango_user'),
      ARANGO_PASSWORD: this.get('arango_password'),
      ARANGO_ROOT_PASSWORD: this.get('arango_root_password'),
    }

    if (conf.ARANGO_URL && conf.ARANGO_DATABASE && conf.ARANGO_PORT_STR && conf.ARANGO_USERNAME && conf.ARANGO_PASSWORD && conf.ARANGO_ROOT_PASSWORD) {
      const ARANGO_PORT = parseInt(conf.ARANGO_PORT_STR)
      if (isNaN(ARANGO_PORT)) {
        throw new InvalidConfig('ArangoDB configuration is invalid. Port must be a number.')
      }

      return {
        URL: conf.ARANGO_URL,
        PORT: ARANGO_PORT,
        DATABASE: conf.ARANGO_DATABASE,
        USERNAME: conf.ARANGO_USERNAME,
        PASSWORD: conf.ARANGO_PASSWORD,
        ROOT_PASSWORD: conf.ARANGO_ROOT_PASSWORD,
      }
    }
    const missingConfigVarNames = Object.entries(conf)
      .filter(([_, value]) => !value)
      .map(([key]) => key)

    throw new InvalidConfig(`ArangoDB configuration is invalid. Missing environment variables: ${missingConfigVarNames.join(', ')}`)
  }

  get(key: string): string | undefined {
    // Generalize formatting of keys, we can add more here as anonymous functions
    const keyFormatters = [(k: string) => k, (k: string) => k.toUpperCase(), (k: string) => k.toLowerCase()]

    // Match the first formatter that gets a truthy value
    const formatter = keyFormatters.find(f => !!process.env[f(key)])

    if (formatter) {
      return process.env[formatter(key)] as string
    } else {
      return undefined
    }
  }
}

export default EnvConfigGateway
