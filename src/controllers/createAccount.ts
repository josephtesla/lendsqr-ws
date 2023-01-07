import { WrapperArguments } from '../helpers'
import { transactionRepository, walletRepository } from '../repositories'
import { WalletService } from '../services'

export const createAccount = async ({ user }: WrapperArguments) => {
  const userId = user?.id as string
  const walletService = new WalletService(transactionRepository, walletRepository)
  return await walletService.createAccount(userId)
}
