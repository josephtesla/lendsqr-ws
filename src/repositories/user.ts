import knexInstance from "../db";
import { IModel, Model } from "../models";
import { IUser } from "../types";
import { BaseRepository } from "./base";

export class UserRepository extends BaseRepository<IUser> {
  constructor(model: IModel<IUser>){
    super(model)
  }

  async findUserWithEmail(email: string){
    return this.model.findOne({ email });
  }
}

const userModel = new Model<IUser>({
  knexConn: knexInstance,
  tableName: 'users'
})

export const userRepository = new UserRepository(userModel)
