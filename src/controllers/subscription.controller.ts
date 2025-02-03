import { NextFunction, Request, Response } from "express";
import { createSubscriptionServices } from "../services/subscription/create-subscription.service";
import { getSubscriptionService } from "../services/subscription/get-subscription.service";

export const getSubscriptionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(res.locals.user.id);
    const result = await getSubscriptionService(userId);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
export const createSubscriptionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await createSubscriptionServices(req.body);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
