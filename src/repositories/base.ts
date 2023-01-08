import { Knex } from 'knex'
import { IBaseEntryType, IModel } from '../models'

export class BaseRepository<T extends IBaseEntryType> {
  readonly model: IModel<T>
  constructor (model: IModel<T>) {
    this.model = model
  }

  async create (entry: any, trx?: Knex.Transaction) {
    return await this.model.create(entry, { trx })
  }

  async getAll (filters: Partial<T>, trx?: Knex.Transaction) {
    return await this.model.find(filters, { trx })
  }

  async getOne (filters: Partial<T>, trx?: Knex.Transaction) {
    return await this.model.findOne(filters, { trx })
  }

  async getOneById (id: string, trx?: Knex.Transaction) {
    return await this.model.findById(id, { trx })
  }

  async updateOne (id: string, props: any, trx?: Knex.Transaction) {
    return await this.model.update(id, props, { trx })
  }

  async deleteOne (id: string, trx?: Knex.Transaction) {
    return await this.model.delete(id, { trx })
  }
}
