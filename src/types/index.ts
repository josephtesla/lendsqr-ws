export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface ISignUpInput {
  name: string;
  email: string;
  password: string;
}

export interface ILoginOutput {
  token: string;
  userId: string;
}

export interface ISignUpOutput {
  token: string;
  userId: string;
}
