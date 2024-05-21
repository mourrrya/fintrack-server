import { Router } from "express";
import { TransactionController } from "../controller/transactionController";

const transactionRouter = Router();

transactionRouter.post("/create", TransactionController.create);
transactionRouter.get("/get", TransactionController.userTxns);
transactionRouter.post("/delete", TransactionController.delete);
transactionRouter.post("/update", TransactionController.update);

export { transactionRouter };

