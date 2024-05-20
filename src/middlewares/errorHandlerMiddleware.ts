import { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/apiErrors";

export const errorHandlerMiddleware = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("error-handler", err);

  if (isErrorInstance(err)) {
    return res.status(err.status).json({ message: err.message });
  }

  const internalErr = ApiError.internal("Unexpected Error");
  return res.status(internalErr.status).json({ message: internalErr.message });
};

function isErrorInstance(error: ApiError) {
  return (
    error &&
    typeof error === "object" &&
    "message" in error &&
    "status" in error
  );
}
