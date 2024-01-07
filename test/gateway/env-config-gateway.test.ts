import { InvalidConfig } from '@/lib/core/exceptions/env-config-exceptions'
import EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port'
import appContainer from '@/lib/infrastructure/ioc/container-config'
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway'

describe('env-config-gateway', () => {
  it('should return the value of the environment variable', async () => {
    const key = 'TEST_ENV_VAR'
    const value = 'test-value'
    process.env[key] = value

    const gateway = appContainer.get<EnvConfigGatewayOutputPort>(GATEWAYS.ENV_CONFIG)

    const result = await gateway.get(key)
    expect(result).toEqual(value)
  })

  it('should return all environment variables for testing', async () => {
    const gateway = appContainer.get<EnvConfigGatewayOutputPort>(GATEWAYS.ENV_CONFIG)

    const result = await gateway.arangoDBConfig()
    expect(result).toBeDefined()
    expect(result).toHaveProperty('URL')
    expect(result).toHaveProperty('PORT')
    expect(result).toHaveProperty('DATABASE')
    expect(result).toHaveProperty('USERNAME')
    expect(result).toHaveProperty('PASSWORD')
    expect(result).toHaveProperty('ROOT_PASSWORD')

    expect(result.URL).toBeDefined()
    expect(result.PORT).toBeDefined()
    expect(result.DATABASE).toBeDefined()
    expect(result.USERNAME).toBeDefined()
    expect(result.PASSWORD).toBeDefined()
    expect(result.ROOT_PASSWORD).toBeDefined()

    // Manually match the expected values with the ones in the .env file that is used for testing

    // NOTE: these should be the same as the ones in the .env file that is used for testing
    const testUSERNAME = 'root'
    const testPASSWORD = 'thereisnospoon'
    const testROOTPASSWORD = 'thereisnospoon'
    const testURL = 'http://localhost'
    const testPORT = 8530
    const testDATABASE = 'metropolis_test'

    expect(result.USERNAME).toBe(testUSERNAME)
    expect(result.PASSWORD).toBe(testPASSWORD)
    expect(result.ROOT_PASSWORD).toBe(testROOTPASSWORD)
    expect(result.URL).toBe(testURL)
    expect(result.PORT).toBe(testPORT)
    expect(result.DATABASE).toBe(testDATABASE)
  })

  it('should return undefined if the required environment variable is not found', async () => {
    const key = `TEST_ENV_VAR_WITHOUT_VALUE-${Math.random()}`
    const gateway = appContainer.get<EnvConfigGatewayOutputPort>(GATEWAYS.ENV_CONFIG)

    const result = await gateway.get(key)
    expect(result).toBeUndefined()
  })
})
