import { ApiError } from "../errors/apiErrors";
import { TransactionDbOps } from "../models/transactionModel";
import { ITransactionModal } from "../types/transactionType";

class TransactionSer {
  async create(transaction: ITransactionModal) {
    try {
      const transactionData = await TransactionDbOps.createTransaction(
        transaction
      );
      return transactionData;
    } catch (error) {
      throw ApiError.internal("Transaction creation failed");
    }
  }

  async userTxns(userId: number) {
    try {
      const transactionData = await TransactionDbOps.userTxns(userId);
      return transactionData;
    } catch (error) {
      throw ApiError.internal("reading user transactions failed");
    }
  }

  async update(txn: ITransactionModal) {
    try {
      const transactionData = await TransactionDbOps.updateTxns(txn);
      return transactionData;
    } catch (error) {
      throw ApiError.internal("reading user transactions failed");
    }
  }

  async delete(txnId: number) {
    try {
      const transactionData = await TransactionDbOps.deleteTxns(txnId);
      return transactionData;
    } catch (error) {
      throw ApiError.internal("Transaction creation failed");
    }
  }
}

export const TransactionService = new TransactionSer();
