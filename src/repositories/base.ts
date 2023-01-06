import { IModel } from "../models";

export class BaseRepository<T> {
  readonly model: IModel<T>;
  constructor(model: IModel<T>){
    this.model = model
  }

  async create(user: any){
    return this.model.create(user);
  }

  async getAll(){
    return this.model.findAll();
  }

  async getOne(filters: Partial<T>) {
    return this.model.find(filters)
  }

  async getOneById(filters: Partial<T>){
    return this.model.findOne(filters)
  }

  async updateOne(id: string, props: string){
    return this.model.update(id, props)
  }

  async deleteOne(id: string){
    return this.model.delete(id)
  }
}
