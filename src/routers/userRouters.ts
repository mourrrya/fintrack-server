import { Router } from "express";
import { UserController } from "../controller/userController";
import { authenticateMiddleware } from "../middlewares/authenticateMiddleware";

const userRouter = Router();

userRouter.post("/signup", UserController.signup);
userRouter.post("/login", UserController.login);
userRouter.post("/refresh-token", UserController.refreshToken);

userRouter.get("/", authenticateMiddleware, UserController.me);

export { userRouter };
