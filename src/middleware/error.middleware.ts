import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError";

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ApiError) {
    const status = err.status;
    const message = err.message;

    res.status(status).json({ message });
  } else {
    res.status(400).json({ message: err.message });
  }

  next();
}
