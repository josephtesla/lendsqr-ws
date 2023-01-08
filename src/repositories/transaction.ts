import { Knex } from "knex";
import { TableNames, TransactionStatus, TransactionType } from "../constants";
import knexInstance from "../db";
import { IModel, Model } from "../models";
import { ITransaction } from "../types";
import { BaseRepository } from "./base";
export class TransactionRepository extends BaseRepository<ITransaction> {
  constructor(model: IModel<ITransaction>) {
    super(model);
  }

  async createDeposit(entry: any, trx?: Knex.Transaction) {
    return await this.model.create(
      {
        type: TransactionType.DEPOSIT,
        status: TransactionStatus.SUCCESSFUL, // since we used a mock payment service
        ...entry,
      },
      { trx }
    );
  }

  async createWithdrawal(entry: any, trx?: Knex.Transaction) {
    return await this.model.create(
      {
        type: TransactionType.WITHDRAW,
        status: TransactionStatus.SUCCESSFUL,
        ...entry,
      },
      { trx }
    );
  }

  async createTransfer(entry: any, trx?: Knex.Transaction) {
    return await this.model.create(
      {
        type: TransactionType.TRANSFER,
        status: TransactionStatus.SUCCESSFUL,
        ...entry,
      },
      { trx }
    );
  }

  async getWalletTransactions(userId: string, walletId: string) {
    // my custom ORM does not support joins and 'or' clauses so we use raw knex for this complex query
    const sqlQuery = `
      SELECT transactions.amount, transactions.type, 
        transactions.status, transactions.userId, transactions.walletId,
        transactions.fromUserWalletId, transactions.toUserWalletId,
        transactions.fromUserId, transactions.toUserId,
        users.name AS userName, users.email AS userEmail,
        fromUsers.name As fromUserName, fromUsers.email As fromUserEmail,
        toUsers.name As toUserName, toUsers.email As toUserEmail,
        transactions.bankAccountNumber, transactions.bankAccountName,transactions.bankName,
        transactions.updatedAt FROM transactions
      LEFT JOIN users ON transactions.userId = users.id
      LEFT JOIN users As fromUsers ON transactions.fromUserId = fromUsers.id
      LEFT JOIN users As toUsers ON transactions.toUserId = toUsers.id
      WHERE userId = ${userId} OR walletId = ${walletId}
        OR fromUserWalletId = ${walletId}
        OR toUserWalletId = ${walletId}
    `;

    const result = await this.model.getKnex().raw(sqlQuery);

    return result[0];
  }
}

const TransactionModel = new Model<ITransaction>({
  knexConn: knexInstance,
  tableName: TableNames.TRANSACTIONS,
});

export const transactionRepository = new TransactionRepository(
  TransactionModel
);
