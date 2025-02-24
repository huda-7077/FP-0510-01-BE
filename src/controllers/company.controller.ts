import { NextFunction, Request, Response } from "express";
import { updateCompanyProfileService } from "../services/company/update-company-profile.service";
import { getCompanyProfileService } from "../services/company/get-company-profile.service";
import { getCompaniesService } from "../services/company/get-companies.service";
import { getCompanyService } from "../services/company/get-company.service";

export const getCompaniesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      take: parseInt(req.query.take as string) || 10,
      page: parseInt(req.query.page as string) || 1,
      sortBy: (req.query.sortBy as string) || "name",
      sortOrder: (req.query.sortOrder as string) || "asc",
      search: (req.query.search as string) || "",
      location: (req.query.location as string) || "",
      industry: (req.query.industry as string) || "",
      establishedYearMin: (req.query.establishedYearMin as string) || undefined,
      establishedYearMax: (req.query.establishedYearMax as string) || undefined,
      hasActiveJobs: (req.query.hasActiveJobs as string) || undefined,
    };

    const result = await getCompaniesService(query);

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getCompanyController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyId = Number(req.params.id);

    const result = await getCompanyService(companyId);

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

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
