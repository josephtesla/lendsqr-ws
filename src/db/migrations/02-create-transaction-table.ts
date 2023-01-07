import { Knex } from "knex";
import { TableNames, TransactionStatus, TransactionType } from "../../constants";

const { USERS, WALLETS, TRANSACTIONS } = TableNames

export async function up(db: Knex): Promise<void> {
  await db.schema.createTable(TRANSACTIONS, (table) => {

    // primary key
    table.increments("id").primary().unsigned();
    table.uuid("_uuid").defaultTo(db.raw("(UUID())"));

    table.enum('type', Object.values(TransactionType));
    table.enum("status", Object.values(TransactionStatus))
    table.decimal("amount", 15, 2).notNullable().checkPositive();

    // Transfer type
    table.integer("fromUserWalletId").unsigned();
    table.foreign("fromUserWalletId").references("id").inTable(WALLETS);

    table.integer("toUserWalletId").unsigned();
    table.foreign("toUserWalletId").references("id").inTable(WALLETS);

    // Deposit and Withdraw types
    table.integer("walletId").unsigned();
    table.foreign("walletId").references("id").inTable(WALLETS);

    table.integer("userId").unsigned();
    table.foreign("userId").references("id").inTable(USERS);

    // Withdraw
    table.string("bankName", 255);
    table.string("bankAccountNumber", 20).checkLength('=', 10);
    table.string("bankAccountName", 255);

    table
      .timestamp("createdAt", { useTz: false })
      .notNullable()
      .defaultTo(db.fn.now());
    table
      .timestamp("updatedAt", { useTz: false })
      .notNullable()
      .defaultTo(db.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(TRANSACTIONS);
}
