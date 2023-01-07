import { WrapperArguments } from '../helpers'
import { transactionRepository, walletRepository } from '../repositories'
import { WalletService } from '../services'

export const withdrawFromAccount = async ({ user, input }: WrapperArguments) => {
  const userId = user?.id as string
  const amount = Number(input.amount)
  const { bankDetails } = input; 
  const walletService = new WalletService(transactionRepository, walletRepository)
  await walletService.withdraw(userId, amount, bankDetails)
}
