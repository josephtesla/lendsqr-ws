import { Knex } from 'knex';

export async function up(db: Knex): Promise<void> {
	await db.schema.createTable('users', (table) => {
		table.uuid('id').primary().defaultTo(db.raw('(UUID())'));
    table.string('name', 255).notNullable();
		table.string('email', 255).unique().notNullable();
		table.string('password', 512).notNullable();
		table.timestamp('createdAt', { useTz: false }).notNullable().defaultTo(db.fn.now());
		table.timestamp('updatedAt', { useTz: false }).notNullable().defaultTo(db.fn.now());
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('users');
}
