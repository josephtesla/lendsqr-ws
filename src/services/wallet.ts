import knexInstance from "../db";
import { BadRequestError, NotFoundError } from "../helpers/error";
import { TransactionRepository, WalletRepository } from "../repositories";
import { IBankAccountInfo } from "../types";
import { PaymentService } from "./payment";

interface IWalletService {
  createAccount: (userId: string) => Promise<any>;
  getAccount: (userId: string) => Promise<any>;
  fundAccount: (userId: string, amount: number) => Promise<any>;
  withdraw: (
    userId: string,
    amount: number,
    bankDetails: IBankAccountInfo
  ) => Promise<any>;
  transferToAccount: (
    senderUserId: string,
    toWalletId: string,
    amount: number
  ) => Promise<any>;
}

export class WalletService implements IWalletService {
  private readonly transactionRepository: TransactionRepository;
  private readonly walletRepository: WalletRepository;

  constructor(
    transactionRepository: TransactionRepository,
    walletRepository: WalletRepository
  ) {
    this.transactionRepository = transactionRepository;
    this.walletRepository = walletRepository;
  }

  async createAccount(userId: string) {
    const existingAccount = await this.walletRepository.getOne({ userId });
    if (existingAccount !== null) {
      throw new BadRequestError("Wallet account already exists for user");
    }

    return await this.walletRepository.create({ userId });
  }

  async getAccount(userId: string) {
    const account = await this.walletRepository.getOne({ userId });
    if (account == null) {
      throw new NotFoundError("Wallet account does not exist for user");
    }

    return account;
  }

  async fundAccount(userId: string, amount: number) {
    if (amount < 0) {
      throw new BadRequestError("Invalid amount value");
    }

    const account = await this.walletRepository.getOne({ userId });
    if (account == null) {
      throw new NotFoundError("Wallet account does not exist for user");
    }

    await PaymentService.makePayment(userId, amount);
    const newBalance = Number(account.balance) + amount;

    await knexInstance.transaction(async (_trx) => {
      await this.walletRepository.updateOne(
        account.id,
        { balance: newBalance },
        _trx
      );
      await this.transactionRepository.createDeposit(
        {
          userId,
          walletId: account.id,
          amount,
        },
        _trx
      );
    });
  }

  async withdraw(
    userId: string,
    amount: number,
    bankDetails: IBankAccountInfo
  ) {
    if (amount < 0) {
      throw new BadRequestError("Invalid amount value");
    }

    const account = await this.walletRepository.getOne({ userId });
    if (account == null) {
      throw new NotFoundError("Wallet account does not exist for user");
    }

    const accountBalance = Number(account.balance);
    if (amount > accountBalance) {
      throw new BadRequestError(
        "Insufficient funds in wallet to withdraw this amount"
      );
    }

    await PaymentService.withdrawToBank(userId, amount, bankDetails);
    const newBalance = accountBalance - amount;
    const { bankName, bankAccountName, bankAccountNumber } = bankDetails;

    await knexInstance.transaction(async (_trx) => {
      await this.walletRepository.updateOne(
        account.id,
        { balance: newBalance },
        _trx
      );
      await this.transactionRepository.createWithdrawal(
        {
          userId,
          walletId: account.id,
          bankAccountName,
          bankAccountNumber,
          bankName,
          amount,
        },
        _trx
      );
    });
  }

  async transferToAccount(userId: string, toWalletId: string, amount: number) {
    if (amount < 0) {
      throw new BadRequestError("Invalid amount value");
    }

    const senderAccount = await this.walletRepository.getOne({ userId });
    if (senderAccount == null) {
      throw new NotFoundError(
        "Wallet account does not exist for the sending user"
      );
    }

    if (senderAccount.id == toWalletId) {
      throw new BadRequestError("Cannot transfer money to the same wallet");
    }

    const senderAccountBalance = Number(senderAccount.balance);
    if (amount > senderAccountBalance) {
      throw new BadRequestError(
        "Insufficient funds in wallet to send this amount"
      );
    }

    const toAccount = await this.walletRepository.getOneById(toWalletId);
    if (toAccount == null) {
      throw new NotFoundError("Recipient Wallet ID does not exist");
    }

    const newSenderAccountBalance = senderAccountBalance - amount;
    const newRecipientAccountBalance = Number(toAccount.balance) + amount;

    await knexInstance.transaction(async (_trx) => {
      await this.walletRepository.updateOne(
        senderAccount.id,
        { balance: newSenderAccountBalance },
        _trx
      );

      await this.walletRepository.updateOne(
        toAccount.id,
        { balance: newRecipientAccountBalance },
        _trx
      );

      await this.transactionRepository.createTransfer(
        {
          toUserWalletId: toAccount.id,
          fromUserWalletId: senderAccount.id,
          toUserId: toAccount.userId,
          fromUserId: userId,
          amount,
        },
        _trx
      );
    });
  }

  async getTransactions(userId: string) {
    const account = await this.walletRepository.getOne({ userId });
    if (account == null) {
      throw new BadRequestError("Wallet account does not exist for user");
    }

    return await this.transactionRepository.getWalletTransactions(
      userId,
      account.id
    );
  }
}
