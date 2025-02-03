import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/apiError";

export const verifySubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const lastSubscription = await prisma.subscription.findFirst({
      where: {
        payment: {
          userId: Number(res.locals.user.id),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (lastSubscription?.status === "ACTIVE") {
      throw new ApiError("You already have an active subscription", 400);
    }
    next();
  } catch (error) {
    next(error);
  }
};
