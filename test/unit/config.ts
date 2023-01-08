module.exports = {
  displayName: 'lendsqr wallet backend',
  rootDir: './',
  roots: ['<rootDir>/tests'],
  verbose: true,
  testEnvironment: 'node',
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./setup.ts'],
  globals: {
    'ts-jest': {
      diagnostics: {
        pathRegex: /\.(spec|test)\.ts$/
      }
    }
  }
}
