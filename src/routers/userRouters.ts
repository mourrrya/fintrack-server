import { Router } from "express";
import { UserController } from "../controller/userController";

const userRouter = Router();

userRouter.post("/signup", UserController.signup);
userRouter.post("/login", UserController.login);

export { userRouter };
