import { NextFunction, Request, Response } from "express";
import { getIndustriesService } from "../services/industry/get-industries.service";

export const getIndustriesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getIndustriesService();
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
