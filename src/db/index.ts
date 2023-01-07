import { Knex, knex } from 'knex'
import { config } from '../config'
import knexConfigurations from './knexfile'

const knexInstance: Knex = knex(
  knexConfigurations[config.environment as keyof typeof knexConfigurations]
)

knexInstance.raw('SELECT 1').then(() => {
  console.log('🚀 -> MySQL Database connected successfully!')
}).catch((e) => {
  console.log('Error connecting to database: ')
  console.error(e)
})

export default knexInstance
