import { Knex } from 'knex'
import { TableNames } from '../../constants'

const { USERS, WALLETS } = TableNames

export async function up (db: Knex): Promise<void> {
  await db.schema.createTable(WALLETS, (table) => {
    table.increments('id').primary().unsigned()
    table.uuid('_uuid').defaultTo(db.raw('(UUID())'))
    table.integer('userId').unsigned().notNullable()
    table.foreign('userId').references('id').inTable(USERS)
    table.decimal('balance', 15, 2).notNullable().defaultTo(0.0)
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
  await knex.schema.dropTable(WALLETS)
}
