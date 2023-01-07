import { Knex } from 'knex'
import { TableNames } from '../constants'
import knexInstance from '../db'
import { IModel, Model } from '../models'
import { IUser } from '../types'
import { BaseRepository } from './base'

export class UserRepository extends BaseRepository<IUser> {
  constructor (model: IModel<IUser>) {
    super(model)
  }

  async findUserWithEmail (email: string, trx?: Knex.Transaction) {
    return await this.model.findOne({ email }, { trx })
  }
}

const userModel = new Model<IUser>({
  knexConn: knexInstance,
  tableName: TableNames.USERS
})

export const userRepository = new UserRepository(userModel)
