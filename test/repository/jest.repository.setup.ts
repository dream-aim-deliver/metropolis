import 'reflect-metadata'
import fetchMock from 'jest-fetch-mock'
import { loadEnvConfig } from '@next/env'

const setupTests = async () => {
  const projectDir = process.cwd()
  await loadEnvConfig(projectDir)
}

fetchMock.enableMocks()

export default setupTests
