import { Knex } from 'knex'
import { TableNames } from '../../constants'

const { USERS } = TableNames

export async function up (db: Knex): Promise<void> {
  await db.schema.createTable(USERS, (table) => {
    table.increments('id').primary().unsigned()
    table.uuid('uuid').defaultTo(db.raw('(UUID())'))
    table.string('name', 255).notNullable()
    table.string('email', 255).unique().notNullable()
    table.string('password', 512).notNullable()
    table
      .timestamp('createdAt', { useTz: false })
      .notNullable()
      .defaultTo(db.fn.now())
    table
      .timestamp('updatedAt', { useTz: false })
      .notNullable()
      .defaultTo(db.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
  })
}

export async function down (knex: Knex): Promise<void> {
  await knex.schema.dropTable(USERS)
}
