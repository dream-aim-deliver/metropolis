import '@testing-library/jest-dom'
import '@testing-library/jest-dom/jest-globals'
import 'reflect-metadata'
import fetchMock from 'jest-fetch-mock'
// import '@inrupt/jest-jsdom-polyfills'
fetchMock.enableMocks()

import { loadEnvConfig } from '@next/env'

const noop = () => {}
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true })

const setupTests = async () => {
  const projectDir = process.cwd()
  await loadEnvConfig(projectDir)
}

export default setupTests
