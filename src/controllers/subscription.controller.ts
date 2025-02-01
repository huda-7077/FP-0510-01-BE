import { NextFunction, Request, Response } from "express";
import { createSubscriptionServices } from "../services/subscription/create-subscription.service";

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
