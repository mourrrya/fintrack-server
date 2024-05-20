import { Router } from "express";
import { userRouter } from "./userRouters";
import { authenticateMiddleware } from "../middlewares/authenticateMiddleware";
import { UserController } from "../controller/userController";

const router = Router();

router.use("/user", userRouter);

router.post("/private", authenticateMiddleware, UserController.privateRoute);

export { router };
