import { NextFunction, Request, Response } from "express";
import { updateCompanyProfileService } from "../services/company/update-company-profile.service";
import { getCompanyProfileService } from "../services/company/get-company-profile.service";

export const getCompanyProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(res.locals.user.id);
    const result = await getCompanyProfileService(userId);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const updateCompanyProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(res.locals.user.id);
    const file = req.files as {
      logo?: Express.Multer.File[];
    };
    const result = await updateCompanyProfileService(userId, req.body, file);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
