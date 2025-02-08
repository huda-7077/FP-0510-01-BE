import { NextFunction, Request, Response } from "express";
import { createSubscriptionCategoryServices } from "../services/subscription-category/create-subscription-category.service";
import { getSubscriptionCategoriesService } from "../services/subscription-category/get-subscription-categories.service";
import { updateSubscriptionCategoryServices } from "../services/subscription-category/update-subscription-categories";

export const getSubscriptionCategoriesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getSubscriptionCategoriesService();
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
export const createSubscriptionCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await createSubscriptionCategoryServices(req.body);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const updateSubscriptionCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await updateSubscriptionCategoryServices(
      Number(req.params.id),
      req.body
    );
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
