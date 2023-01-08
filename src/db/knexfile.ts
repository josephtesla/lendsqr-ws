import { config } from '../config'

const environmentConfig = {
  client: 'mysql',
  connection: {
    host: config.dbHost,
    port: config.dbPort,
    database: config.dbName,
    user: config.dbUser,
    password: config.dbPass
  },
  debug: ['development'].includes(config.environment),
  migrations: {
    tableName: '_migrations',
    directory: './migrations'
  }
}

const knexConfigurations = {
  development: environmentConfig,
  test: environmentConfig,
  staging: environmentConfig,
  production: environmentConfig
}

export default knexConfigurations
