import { NextFunction, Request, Response } from "express";
import { getDeveloperOverviewService } from "../services/overview/get-developer-overview.service";

export const getDeveloperOverviewController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getDeveloperOverviewService();
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
