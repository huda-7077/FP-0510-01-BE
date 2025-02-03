import { NextFunction, Request, Response } from "express";
import { XENDIT_CALLBACK_TOKEN } from "../config";
import { ApiError } from "../utils/apiError";

export const xenditWebhookMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const xenditToken = req.headers["x-callback-token"];

    if (typeof xenditToken !== "string") {
      throw new ApiError("Invalid token format", 400);
    }

    if (xenditToken !== XENDIT_CALLBACK_TOKEN) {
      throw new ApiError("Unauthorized webhook request", 401);
    }

    next();
  } catch (error) {
    next(error);
  }
};
