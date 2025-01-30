import { NextFunction, Request, Response } from "express";
import { getCompanyLocationService } from "../services/company-location/get-company-location.service";

export const getCompanyLocationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await getCompanyLocationService(parseInt(id));
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
