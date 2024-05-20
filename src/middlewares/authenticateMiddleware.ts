import { NextFunction, Request, Response } from "express";
import { ApiError, handleError } from "../errors/apiErrors";
import { TokenService } from "../services/tokenServices";

export const authenticateMiddleware = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const accessToken = authHeader?.split(" ")[1];
  if (!accessToken) {
    return next(ApiError.unauthenticated("access denied, token not provided"));
  }
  try {
    const user = TokenService.validateAccessToken(accessToken);
    req.user = user;
    next();
  } catch (error) {
    handleError(error, next);
  }
};
