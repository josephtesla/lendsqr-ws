import { Knex } from "knex";

export interface IModel<T> {
  create: (entry: any) => Promise<any>;
  findAll: () => Promise<any>;
  find: (filters: Partial<T>) => Promise<any>;
  findOne: (filters: Partial<T>) => Promise<any>;
  update: (id: string, props: any) => Promise<any>;
  delete: (id: string) => Promise<any>;
}

interface IModelProps {
  knexConn: Knex;
  tableName: string;
  selectableProps?: string[];
}

interface IBaseEntryType {
  id?: string;
}

export class Model<T extends IBaseEntryType> implements IModel<T> {
  private readonly knex: Knex<T>;
  private readonly tableName: string;
  private readonly selectableProps: string[];
  public query: any;
  private static timeout = 3000;

  constructor({ knexConn, tableName, selectableProps = [] }: IModelProps) {
    this.knex = knexConn;
    this.tableName = tableName;
    this.selectableProps = selectableProps;
    this.query = this.knex.from(tableName);
  }

  async create(entry: any) {
    delete entry.id;
    let result = await this.knex
      .insert(entry, this.selectableProps)
      .into(this.tableName)
      .timeout(Model.timeout);

    const insertId = result[0];
    result = await this.knex
    .select(this.selectableProps)
    .from(this.tableName)
    .where({ id: insertId })
    .timeout(Model.timeout);

    return result[0]
  }

  async findAll() {
    return this.knex
      .select(this.selectableProps)
      .from(this.tableName)
      .timeout(Model.timeout);
  }

  async find(filters: Partial<T>) {
    return this.knex
      .select(this.selectableProps)
      .from(this.tableName)
      .where(filters)
      .timeout(Model.timeout);
  }

  async findOne(filters: Partial<T>) {
    const rows = await this.knex
      .select(this.selectableProps)
      .from(this.tableName)
      .where(filters)
      .timeout(Model.timeout);
    
    if (rows.length === 0){
      return null
    }
    
    return rows[0]
  }

  async update(id: string, props: any) {
    delete props.id;
    return this.knex
      .update(props)
      .from(this.tableName)
      .where({
        id
      })
      .timeout(Model.timeout);
  }

  async delete(id: string) {
    return this.knex
      .del()
      .from(this.tableName)
      .where({
        id, 
      })
      .timeout(Model.timeout);
  }
}
