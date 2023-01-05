import knexInstance from "../db";
import { IUser } from "../types";
import { Model } from ".";

export const userModel = new Model<IUser>({
  knexConn: knexInstance,
  tableName: 'users'
})
