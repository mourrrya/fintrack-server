import { NextFunction, Request, Response } from "express";
import { CONSTANTS } from "../constants/constants";
import { UserDto } from "../dtos/userDto";
import { ApiError, handleError } from "../errors/apiErrors";
import { UserDbOps } from "../models/userModel";
import { TokenService } from "../services/tokenServices";
import { UserService } from "../services/userServices";
import { IUserModel, UserRes } from "../types/userType";
import { isEmpty } from "lodash";

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
      res.cookie(
        CONSTANTS.REFRESH_TOKEN_COOKIE_KEY,
        userAndToken.token.refreshToken
      );
      res.json({
        ...userAndToken.user,
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
      res.cookie(
        CONSTANTS.REFRESH_TOKEN_COOKIE_KEY,
        userAndToken.token.refreshToken
      );
      res.json({
        ...userAndToken.user,
        accessToken: userAndToken.token.accessToken,
      });
    } catch (error) {
      handleError(error, next);
    }
  }

  async refreshToken(req: Request, res: Response<UserRes>, next: NextFunction) {
    try {
      const refreshTokenInCookie =
        req.cookies[CONSTANTS.REFRESH_TOKEN_COOKIE_KEY];
      if (!refreshTokenInCookie) {
        throw ApiError.unauthenticated("refresh token not found");
      }
      const userDto = TokenService.validateRefreshToken(refreshTokenInCookie);
      const { accessToken, refreshToken } = TokenService.generateToken(userDto);
      const savedToken = await TokenService.saveToken(
        userDto,
        refreshToken,
        accessToken
      );
      res.cookie(CONSTANTS.REFRESH_TOKEN_COOKIE_KEY, refreshToken);
      res.json({
        ...userDto,
        accessToken: savedToken.getDataValue("accessToken"),
      });
    } catch (error) {
      handleError(error, next);
    }
  }
}

const UserController = new UserControl();

export { UserController };
