import knexInstance from '../db'
import { BadRequestError, NotFoundError } from '../helpers/error'
import { TransactionRepository, WalletRepository } from '../repositories'
import { PaymentService } from './payment'

interface IWalletService {}

export class WalletService implements IWalletService {
  private readonly transactionRepository: TransactionRepository
  private readonly walletRepository: WalletRepository

  constructor (
    transactionRepository: TransactionRepository,
    walletRepository: WalletRepository
  ) {
    this.transactionRepository = transactionRepository
    this.walletRepository = walletRepository
  }

  async createAccount (userId: string) {
    const existingAccount = this.walletRepository.getOne({ userId })
    if (existingAccount !== null) {
      throw new BadRequestError('Wallet account already exists for user')
    }

    return await this.walletRepository.create({ userId })
  }

  async getAccount (userId: string) {
    const account = this.walletRepository.getOne({ userId })
    if (account == null) {
      throw new NotFoundError('Wallet account does not exist for user')
    }

    return await account
  }

  async fundAccount (userId: string, amount: number) {
    const account = await this.walletRepository.getOne({ userId })
    if (account == null) {
      throw new NotFoundError('Wallet account does not exist for user')
    }

    if (amount < 0) {
      throw new BadRequestError('Invalid amount value')
    }

    await PaymentService.makePayment(userId, amount)
    const newBalance = Number(account.balance) + amount

    await knexInstance.transaction(async (_trx) => {
      await this.walletRepository.updateOne(account.id, { balance: newBalance }, _trx)
      await this.transactionRepository.createDeposit({
        userId,
        walletId: account.id,
        amount
      }, _trx)
    })
  }

  async withdraw(userId: string, amount: number, bankDetails: any) {
    const account = await this.walletRepository.getOne({ userId })
    if (account == null) {
      throw new NotFoundError('Wallet account does not exist for user')
    }

    if (amount < 0) {
      throw new BadRequestError('Invalid amount value')
    }

    const accountBalance = Number(account.balance)
    if (amount > accountBalance) {
      throw new BadRequestError('Insufficient funds in wallet to withdraw this amount')
    }

    await PaymentService.withdrawToBank(userId, amount, bankDetails)

    const newBalance = accountBalance - amount
    await knexInstance.transaction(async (_trx) => {
      await this.walletRepository.updateOne(account.id, { balance: newBalance }, _trx)
      await this.transactionRepository.createWithdrawal({
        userId,
        walletId: account.id,
        amount
      }, _trx)
    })
  }
}
