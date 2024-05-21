import { NextFunction, Request, Response } from "express";
import { UserDto } from "../dtos/userDto";
import { ApiError, handleError } from "../errors/apiErrors";
import { TokenService } from "../services/tokenServices";
import { UserService } from "../services/userServices";
import { IUserModel, UserRes } from "../types/userType";

class UserControl {
  async signup(
    req: Request<{}, {}, IUserModel>,
    res: Response<UserRes>,
    next: NextFunction
  ) {
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
      const userAndToken = await UserService.signup(username, password);
      res.json({
        ...userAndToken.user,
        refreshToken: userAndToken.token.refreshToken,
        accessToken: userAndToken.token.accessToken,
      });
    } catch (error) {
      handleError(error, next);
    }
  }

  async login(
    req: Request<{}, {}, IUserModel>,
    res: Response<UserRes>,
    next: NextFunction
  ) {
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
      const userAndToken = await UserService.login(username, password);
      res.json({
        ...userAndToken.user,
        refreshToken: userAndToken.token.refreshToken,
        accessToken: userAndToken.token.accessToken,
      });
    } catch (error) {
      handleError(error, next);
    }
  }

  async refreshToken(
    req: Request<string>,
    res: Response<UserRes>,
    next: NextFunction
  ) {
    try {
      const token = req.body.refreshToken;
      if (!token) {
        throw ApiError.unauthenticated("refresh token not found");
      }
      const userDto = TokenService.validateRefreshToken(token);
      const { accessToken, refreshToken } = TokenService.generateToken(userDto);
      const savedToken = await TokenService.saveToken(
        userDto,
        refreshToken,
        accessToken
      );
      res.json({
        ...userDto,
        refreshToken: savedToken.getDataValue("refreshToken"),
        accessToken: savedToken.getDataValue("accessToken"),
      });
    } catch (error) {
      handleError(error, next);
    }
  }

  async me(req: Request, res: Response<UserDto>, next: NextFunction) {
    try {
      if (!req.user) {
        return next(ApiError.badRequest("User not found"));
      }
      res.json(req.user);
    } catch (error) {
      handleError(error, next);
    }
  }
}

const UserController = new UserControl();

export { UserController };

