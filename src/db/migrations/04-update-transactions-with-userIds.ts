import { Knex } from "knex";
import { TableNames } from "../../constants";

const { TRANSACTIONS, WALLETS } = TableNames;

export async function up(db: Knex): Promise<void> {
  const transactions = await db(TRANSACTIONS).whereNotNull("fromUserWalletId")
  transactions.forEach(async (transaction) => {
    const fromUserWallets = await db
      .select("userId")
      .from(WALLETS)
      .where({ id: transaction.fromUserWalletId });
    const fromUserWallet = fromUserWallets[0]

    const toUserWallets = await db
      .select("userId")
      .from(WALLETS)
      .where({ id: transaction.toUserWalletId });
    const toUserWallet = toUserWallets[0]

    await db
      .update({
        fromUserId: fromUserWallet.userId,
        toUserId: toUserWallet.userId,
      })
      .from(TRANSACTIONS)
      .where({ id: transaction.id });
  });
}

export async function down(knex: Knex): Promise<void> {

}
