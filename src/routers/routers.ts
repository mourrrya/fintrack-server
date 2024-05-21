import { Router } from "express";
import { userRouter } from "./userRouters";
import { authenticateMiddleware } from "../middlewares/authenticateMiddleware";
import { transactionRouter } from "./transactionRoute";

const router = Router();

router.use("/user", userRouter);

router.use("/transaction", authenticateMiddleware, transactionRouter);

export { router };
