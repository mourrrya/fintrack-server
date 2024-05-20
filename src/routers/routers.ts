import { Router } from "express";
import { userRouter } from "./userRouters";

const router = Router();

router.use("/user", userRouter);

export { router };

