import { DataTypes, Model, ModelStatic } from "sequelize";
import { sequelize } from "../db";
import { ITransactionModal } from "../types/transactionType";
import { UserModel } from "./userModel";

export const TransactionModal: ModelStatic<Model<ITransactionModal>> =
  sequelize.define("transaction", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    transactionAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    transactionType: {
      type: DataTypes.ENUM("INCOME", "EXPENSE"),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserModel,
        key: "id",
      },
    },
  });

class Transaction {
  async createTransaction(
    payload: ITransactionModal
  ): Promise<Model<ITransactionModal>> {
    const transaction = await TransactionModal.create(payload);
    return transaction;
  }

  async userTxns(userId: number): Promise<Model<ITransactionModal>[]> {
    const userTransactions = await TransactionModal.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });
    return userTransactions;
  }

  async updateTxns(txn: ITransactionModal): Promise<number[]> {
    const numberOfRowAffected = await TransactionModal.update(
      { title: txn.title, transactionAmount: txn.transactionAmount },
      {
        where: { id: txn.id },
      }
    );
    return numberOfRowAffected;
  }

  async deleteTxns(txnId: number): Promise<number> {
    const numberOfRowDeleted = await TransactionModal.destroy({
      where: { id: txnId },
    });

    return numberOfRowDeleted;
  }
}

export const TransactionDbOps = new Transaction();
