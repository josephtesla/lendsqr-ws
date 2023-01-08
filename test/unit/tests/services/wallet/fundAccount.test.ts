import {
  transactionRepository,
  WalletRepository,
} from "../../../../../src/repositories";
import { WalletService } from "../../../../../src/services";

describe("fundAccount", () => {
  it("it funds an account for a user with userId", async () => {
    const amount = 2000;
    const stubAccount = {
      id: 1,
      userId: "1",
      balance: 34290.78,
      createdAt: "2023-01-07T15:01:30.000Z",
      updatedAt: "2023-01-08T00:08:06.000Z",
    };

    const walletRepository = {
      getOne: jest.fn(() => stubAccount),
    } as unknown as WalletRepository;

    const walletService = new WalletService(
      transactionRepository,
      walletRepository
    );

    const result = await walletService.fundAccount(stubAccount.userId, amount);
    expect(result).not.toBeNull();
    expect(result).toMatchObject({
      success: true,
    });
  });
});
