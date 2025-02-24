import { NextFunction, Request, Response } from "express";
import { GetUsersEducationLevelByJobIdService } from "../services/user/get-user-education-levels-by-job-id.service";
import { getUsersCountByProvinceService } from "../services/user/get-user-count-by-provinces";
import { getUsersCountByAgeRangesService } from "../services/user/get-user-count-by-age-ranges.service";
import { getUserCountByGenderService } from "../services/user/get-user-count-by-gender.service";

export const getUserEducationLevelsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      jobId: parseInt(req.query.jobId as string) || 0,
    };

    const result = await GetUsersEducationLevelByJobIdService(query);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getUsersAgeRangesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getUsersCountByAgeRangesService();
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getUsersGenderCountController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getUserCountByGenderService();
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getUsersCountByProvinceController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getUsersCountByProvinceService();
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
