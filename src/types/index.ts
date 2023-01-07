import { TransactionStatus, TransactionType } from '../constants'

export interface IUser {
  id: string
  name: string
  email: string
  password: string
  createdAt: string
  updatedAt: string
}

export interface IWallet {
  id: string
  userId: string
  balance: number
  createdAt: string
  updatedAt: string
}

export interface ITransaction {
  id: string
  type: TransactionType
  status: TransactionStatus
  amount: number

  // transfer
  fromUserWalletId?: string
  toUserWalletId?: string

  // deposit and withdraw
  walletId?: string
  userId?: string

  // withdraw
  bankName?: string
  bankAccountName?: string
  bankAccountNumber?: string

  createdAt: string
  updatedAt: string
}

export interface ILoginInput {
  email: string
  password: string
}

export interface ISignUpInput {
  name: string
  email: string
  password: string
}

export interface ILoginOutput {
  token: string
  userId: string
}

export interface ISignUpOutput {
  token: string
  userId: string
}
