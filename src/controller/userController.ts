import { NextFunction, Request, Response } from "express";
import { ApiError, handleError } from "../errors/apiErrors";
import { UserService } from "../services/userServices";

class UserControl {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      if (!username) {
        next(ApiError.badRequest("username is required"));
        return;
      }
      if (!password) {
        next(ApiError.badRequest("password is required"));
        return;
      }
      const user = await UserService.signup(username, password);
      res.json(user);
    } catch (error) {
      handleError(error, next);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      if (!username) {
        next(ApiError.badRequest("username is required"));
        return;
      }
      if (!password) {
        next(ApiError.badRequest("password is required"));
        return;
      }
      const user = await UserService.login(username, password);
      res.json(user);
    } catch (error) {
      handleError(error, next);
    }
  }
}

const UserController = new UserControl();

export { UserController };
