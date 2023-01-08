import { logger } from "../logger";
import { IBankAccountInfo } from "../types";

export class PaymentService {

  // Fake Payment Service

  static async makePayment(userId: string, amount: number) {
    return await new Promise((resolve, reject) => {
      setTimeout(() => {
        logger.info(`Payment successful. userId ${userId}, amount: ${amount}`);
        resolve(true);
      }, 1000);
    });
  }

  static async withdrawToBank(
    walletId: string,
    amount: number,
    bankDetails: IBankAccountInfo
  ) {
    return await new Promise((resolve, reject) => {
      setTimeout(() => {
        logger.info(
          `Withdrawal successful. walletId ${walletId}, amount: ${amount} details: ${bankDetails}`
        );
        resolve(true);
      }, 1000);
    });
  }
}
