import { Request } from "express";
import { IUserModel } from "./userType";
import { UserDto } from "../dtos/userDto";

declare module "express-serve-static-core" {
  interface Request {
    user?: UserDto;
  }
}
