import {
  ConfigNotFound,
  InvalidConfig,
} from '@/lib/core/exceptions/env-config-exceptions'
import EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port'
import appContainer from '@/lib/infrastructure/ioc/container-config'
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway'

describe('env-config-gateway', () => {
  it('should return the value of the environment variable', async () => {
    const key = 'TEST_ENV_VAR'
    const value = 'test-value'
    process.env[key] = value
    const gateway = appContainer.get<EnvConfigGatewayOutputPort>(
      GATEWAYS.ENV_CONFIG,
    )
    const result = await gateway.get(key)
    expect(result).toEqual(value)
  })
})
