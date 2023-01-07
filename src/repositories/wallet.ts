import { TableNames } from '../constants'
import knexInstance from '../db'
import { IModel, Model } from '../models'
import { IWallet } from '../types'
import { BaseRepository } from './base'

export class WalletRepository extends BaseRepository<IWallet> {
  constructor (model: IModel<IWallet>) {
    super(model)
  }
}

const walletModel = new Model<IWallet>({
  knexConn: knexInstance,
  tableName: TableNames.WALLETS
})

export const walletRepository = new WalletRepository(walletModel)
