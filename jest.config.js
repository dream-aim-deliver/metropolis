module.exports = {
  projects: [
    '<rootDir>/test/api/jest.api.config.js',
    '<rootDir>/test/component/jest.component.config.js',
    '<rootDir>/test/gateway/jest.gateway.config.js',
    '<rootDir>/test/repository/jest.repository.config.js',
    '<rootDir>/test/sdk/jest.sdk.config.js',
  ],
  setupFiles: ['<rootDir>/test/setupJest.js'],
}
