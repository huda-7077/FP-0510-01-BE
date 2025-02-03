import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError";

export const verifyRole = (roles: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.user || res.locals.user.role !== roles) {
      throw new ApiError("Unauthorized request", 401);
    }

    next();
  };
};
