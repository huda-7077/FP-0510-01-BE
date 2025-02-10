import { NextFunction, Request, Response } from "express";
import { createSubscriptionServices } from "../services/subscription/create-subscription.service";
import { getSubscriptionService } from "../services/subscription/get-subscription.service";
import { getSubscriptionsService } from "../services/subscription/get-subscriptions.service";
import { SubscriptionStatus } from "@prisma/client";

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

export const getSubscriptionsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      take: parseInt(req.query.take as string) || 3,
      page: parseInt(req.query.page as string) || 1,
      sortBy: (req.query.sortBy as string) || "createdAt",
      sortOrder: (req.query.sortOrder as string) || "desc",
      search: (req.query.search as string) || "",
      status: Object.values(SubscriptionStatus).includes(
        req.query.status as SubscriptionStatus
      )
        ? (req.query.status as SubscriptionStatus)
        : undefined,
    };
    const result = await getSubscriptionsService(query);
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
