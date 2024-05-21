import { NextFunction, Request, Response } from "express";
import { handleError } from "../errors/apiErrors";
import { TransactionService } from "../services/transactionService";
import { ITransaction, ITransactionModal } from "../types/transactionType";

class TransactionCtrl {
  async create(
    req: Request<{}, {}, ITransaction>,
    res: Response<ITransactionModal>,
    next: NextFunction
  ) {
    try {
      const transaction = await TransactionService.create({
        ...req.body,
        userId: req.user?.id!,
      });

      res.json(transaction.toJSON());
    } catch (error) {
      handleError(error, next);
    }
  }
  async userTxns(
    req: Request,
    res: Response<ITransactionModal[]>,
    next: NextFunction
  ) {
    try {
      const userTxnList = await TransactionService.userTxns(req.user?.id!);
      const formattedUserTxnList = userTxnList.map((transaction) =>
        transaction.toJSON()
      );
      res.json(formattedUserTxnList);
    } catch (error) {
      handleError(error, next);
    }
  }
  async delete(
    req: Request<{}, {}, { id: number }>,
    res: Response<number>,
    next: NextFunction
  ) {
    try {
      const numberOfRowDeleted = await TransactionService.delete(req.body.id);
      res.json(numberOfRowDeleted);
    } catch (error) {
      handleError(error, next);
    }
  }
  async update(
    req: Request<{}, {}, ITransactionModal>,
    res: Response<number[]>,
    next: NextFunction
  ) {
    try {
      const numberOfRowAffected = await TransactionService.update(req.body);
      res.json(numberOfRowAffected);
    } catch (error) {
      handleError(error, next);
    }
  }
}

const TransactionController = new TransactionCtrl();

export { TransactionController };
