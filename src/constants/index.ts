export const TableNames = Object.freeze({
  USERS: "users",
  WALLETS: "wallets",
  TRANSACTIONS: "transactions"
})

export enum TransactionStatus {
  PENDING = "pending",
  SUCCESSFUL = "successful",
  FAILED = "failed"
}

export enum TransactionType {
  DEPOSIT = "deposit",
  TRANSFER = "transfer",
  WITHDRAW = "withdraw"
}
