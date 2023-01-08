import { Knex } from "knex";
import {
  TableNames,
} from "../../constants";

const { USERS, TRANSACTIONS } = TableNames;

export async function up(db: Knex): Promise<void> {
  await db.schema.alterTable(TRANSACTIONS, (table) => {
    // Transfer type
    table.integer("fromUserId").unsigned();
    table.foreign("fromUserId").references("id").inTable(USERS);

    table.integer("toUserId").unsigned();
    table.foreign("toUserId").references("id").inTable(USERS);
  });
}

export async function down(knex: Knex): Promise<void> {
  
}
