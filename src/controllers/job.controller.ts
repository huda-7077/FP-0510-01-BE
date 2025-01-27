import { NextFunction, Request, Response } from "express";
import { getJobsService } from "../services/job/get-jobs.service";
import { getJobCategoriesService } from "../services/job/get-jobs-categories.service";

export const getJobsController = async (
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
      category: (req.query.category as string) || "",
      isPublished: (req.query.isPublished as string) || "",
      isDeleted: (req.query.isDeleted as string) || "",
      companyId: parseInt(req.query.companyId as string) || 0,
    };

    const result = await getJobsService(query);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getJobCategoriesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      companyId: parseInt(req.query.companyId as string) || 0,
    };

    const result = await getJobCategoriesService(query);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
