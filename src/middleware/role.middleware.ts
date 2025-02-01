import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError";
import { UserRole } from "@prisma/client";

export const verifyRoleUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // if (res.locals.user.role !== UserRole.USER) {
    //   throw new ApiError("Unauthorized request", 401);
    // }

    console.log(res.locals.user.role);

    next();
  } catch (error) {
    next(error);
  }
};
