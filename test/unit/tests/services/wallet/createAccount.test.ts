import {
  TransactionRepository,
  WalletRepository,
} from "../../../../../src/repositories";
import { WalletService } from "../../../../../src/services";

describe("createAccount", () => {
  it("creates a wallet account for a user with userId", async () => {
    const userId = "123"
    const stubAccount = {
      "id": 1,
      "userId": 1,
      "balance": 34290.78,
      "createdAt": "2023-01-07T15:01:30.000Z",
      "updatedAt": "2023-01-08T00:08:06.000Z"
    };

    const walletRepository = {
      getOne: jest.fn(() => null),
      create: jest.fn(() => stubAccount)
    } as unknown as WalletRepository
    const transactionRepository = {} as unknown as TransactionRepository

    const walletService = new WalletService(
      transactionRepository,
      walletRepository
    );

    const result = await walletService.createAccount(userId)
    expect(walletRepository.create).toHaveBeenCalledTimes(1)
    expect(result).not.toBeNull()
    expect(result).toMatchObject(stubAccount)
  });
});
