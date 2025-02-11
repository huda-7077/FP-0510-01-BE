import { NextFunction, Request, Response } from "express";
import { getCompanyLocationService } from "../services/company-location/get-company-location.service";
import { getCompanyLocationsService } from "../services/company-location/get-company-locations.service";

export const getCompanyLocationsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      take: parseInt(req.query.take as string) || 3,
      page: parseInt(req.query.page as string) || 1,
      sortBy: (req.query.sortBy as string) || "id",
      sortOrder: (req.query.sortOrder as string) || "desc",
      search: (req.query.search as string) || "",
      companyId: parseInt(req.query.companyId as string),
    };

    const result = await getCompanyLocationsService(query);
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
