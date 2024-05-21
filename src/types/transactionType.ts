export type TransactionType = "INCOME" | "EXPENSE";

export interface ITransaction {
  id?: number;
  title: string;
  transactionType: TransactionType;
  transactionAmount: number;
}

export interface ITransactionModal extends ITransaction {
  userId: number;
}
