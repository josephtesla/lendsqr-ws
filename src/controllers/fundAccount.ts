import { WrapperArguments } from '../helpers'
import { transactionRepository, walletRepository } from '../repositories'
import { WalletService } from '../services'

export const fundAccount = async ({ user, input }: WrapperArguments) => {
  const userId = user?.id as string
  const amount = Number(input.amount)
  const walletService = new WalletService(transactionRepository, walletRepository)
  await walletService.fundAccount(userId, amount)
}
