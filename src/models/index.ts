import { Knex } from 'knex'

export interface IModel<T> {
  create: (entry: any, options?: IQueryOptions) => Promise<any>
  findAll: (options?: IQueryOptions) => Promise<any>
  find: (filters: Partial<T>, options?: IQueryOptions) => Promise<any>
  findOne: (filters: Partial<T>, options?: IQueryOptions) => null | Promise<any>
  update: (id: string, props: any, options?: IQueryOptions) => Promise<any>
  delete: (id: string, options?: IQueryOptions) => Promise<any>
}

interface IModelProps {
  knexConn: Knex
  tableName: string
  selectableProps?: string[]
}

interface IBaseEntryType {
  id?: string
}

export interface IQueryOptions {
  trx?: Knex.Transaction
}

export const withTransaction = (
  qb: Knex.QueryBuilder,
  trx: Knex.Transaction | undefined
) => {
  if (trx == null) return qb
  return qb.transacting(trx)
}

export class Model<T extends IBaseEntryType> implements IModel<T> {
  private readonly knex: Knex<T>
  private readonly tableName: string
  private readonly selectableProps: string[]
  public query: any
  private static readonly timeout = 3000

  constructor ({ knexConn, tableName, selectableProps = [] }: IModelProps) {
    this.knex = knexConn
    this.tableName = tableName
    this.selectableProps = selectableProps
    this.query = this.knex.from(tableName)
  }

  async create (entry: any, { trx }: IQueryOptions = {}) {
    delete entry.id
    let result = await withTransaction(
      this.knex
        .insert(entry, this.selectableProps)
        .into(this.tableName)
        .timeout(Model.timeout),
      trx
    )

    const insertId = result[0]
    result = await withTransaction(
      this.knex
        .select(this.selectableProps)
        .from(this.tableName)
        .where({ id: insertId })
        .timeout(Model.timeout),
      trx
    )
    return result[0]
  }

  async findAll (options: IQueryOptions = {}) {
    const { trx } = options
    return await withTransaction(
      this.knex
        .select(this.selectableProps)
        .from(this.tableName)
        .timeout(Model.timeout),
      trx
    )
  }

  async find (filters: Partial<T>, options: IQueryOptions = {}) {
    const { trx } = options
    return await withTransaction(
      this.knex
        .select(this.selectableProps)
        .from(this.tableName)
        .where(filters)
        .timeout(Model.timeout),
      trx
    )
  }

  async findOne (filters: Partial<T>, { trx }: IQueryOptions = {}) {
    const rows = await withTransaction(
      this.knex
        .select(this.selectableProps)
        .from(this.tableName)
        .where(filters)
        .timeout(Model.timeout),
      trx
    )

    if (rows.length === 0) {
      return null
    }

    return rows[0]
  }

  async update (id: string, props: any, { trx }: IQueryOptions = {}) {
    delete props.id
    const queryBd = this.knex
      .update(props)
      .from(this.tableName)
      .where({ id })
      .timeout(Model.timeout)

    return await withTransaction(queryBd, trx)
  }

  async delete (id: string, { trx }: IQueryOptions = {}) {
    return await withTransaction(
      this.knex.del().from(this.tableName).where({ id }).timeout(Model.timeout),
      trx
    )
  }
}
