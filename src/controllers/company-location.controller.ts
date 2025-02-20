import { NextFunction, Request, Response } from "express";
import { getCompanyLocationService } from "../services/company-location/get-company-location.service";
import { createCompanyLocationService } from "../services/company-location/create-company-location.service";
import { getCompanyLocationsService } from "../services/company-location/get-company-locations.service";
import { deleteCompanyLocationService } from "../services/company-location/delete-company-location.service";
import { TimeRange } from "../services/job/get-popular-job-categories.service";
import { getPopularCompanyLocationsService } from "../services/company-location/get-popular-company-locations.service";

export const createCompanyLocationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(res.locals.user.id);
    const result = await createCompanyLocationService(userId, req.body);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

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

export const getCompanyLocationsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(res.locals.user.id);
    const result = await getCompanyLocationsService(userId);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getPopularCompanyLocationsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const timeRange = (req.query.timeRange as TimeRange) || "Last 5 years";

    const result = await getPopularCompanyLocationsService(timeRange);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const deleteCompanyLocationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(res.locals.user.id);
    const { id } = req.params;
    const result = await deleteCompanyLocationService(Number(id), userId);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
