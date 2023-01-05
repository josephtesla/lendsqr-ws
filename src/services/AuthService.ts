import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import { BadRequestError, NotAuthenticatedError } from "../helpers/error";
import { Model } from "../models";
import {
  ILoginInput,
  ILoginOutput,
  ISignUpInput,
  ISignUpOutput,
  IUser,
} from "../types";

const { jwtExpiresIn, jwtSecret } = config;

interface IAuthService {
  login: (input: ILoginInput) => Promise<ILoginOutput>;
  signUp: (input: ISignUpInput) => Promise<ISignUpOutput>;
}

export class AuthService implements IAuthService {
  private userModel: Model<IUser>;

  constructor(userModel: Model<IUser>) {
    this.userModel = userModel;
  }

  async login({ email, password }: ILoginInput) {
    const existingUser = await this.userModel.findOne({ email });
    if (!existingUser || !bcrypt.compareSync(password, existingUser.password)) {
      throw new NotAuthenticatedError("Invalid email address or password");
    }

    const token = AuthService.generateAccessToken(existingUser);
    const { id: userId } = existingUser;
    return {
      token,
      userId,
    };
  }

  async signUp({ name, email, password }: ISignUpInput) {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("Email address already in use!");
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const { id: userId } = user;
    const token = AuthService.generateAccessToken(user);
    return {
      token,
      userId,
    };
  }

  static generateAccessToken(user: IUser) {
    return jwt.sign({ user }, jwtSecret, { expiresIn: jwtExpiresIn });
  }

  static verifyAuthToken(token: string): JwtPayload {
    return jwt.verify(token, jwtSecret) as JwtPayload;
  }
}
