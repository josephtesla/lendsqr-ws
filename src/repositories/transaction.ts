import { Knex } from 'knex'
import { TableNames, TransactionStatus, TransactionType } from '../constants'
import knexInstance from '../db'
import { IModel, Model } from '../models'
import { ITransaction } from '../types'
import { BaseRepository } from './base'

export class TransactionRepository extends BaseRepository<ITransaction> {
  constructor (model: IModel<ITransaction>) {
    super(model)
  }

  async createDeposit (entry: any, trx?: Knex.Transaction) {
    return await this.model.create({
      type: TransactionType.DEPOSIT,
      status: TransactionStatus.SUCCESSFUL, // since we used a mock payment service
      ...entry
    }, { trx })
  }

  async createWithdrawal (entry: any, trx?: Knex.Transaction) {
    return await this.model.create({
      type: TransactionType.WITHDRAW,
      status: TransactionStatus.SUCCESSFUL,
      ...entry
    }, { trx })
  }

  async createTransfer (entry: any, trx?: Knex.Transaction) {
    return await this.model.create({
      type: TransactionType.TRANSFER,
      status: TransactionStatus.SUCCESSFUL,
      ...entry
    }, { trx })
  }
}

const TransactionModel = new Model<ITransaction>({
  knexConn: knexInstance,
  tableName: TableNames.TRANSACTIONS
})

export const transactionRepository = new TransactionRepository(
  TransactionModel
)
