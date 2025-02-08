import { NextFunction, Request, Response } from "express";
import { getJobApplicationsTotalService } from "../services/job-application/get-job-applications-total.service";
import { getJobApplicationsService } from "../services/job-application/get-job-applications.service";
import { updateJobApplicationService } from "../services/job-application/update-job-application.service";

export const updateJobApplicationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await updateJobApplicationService(req.body, parseInt(id));
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getJobApplicationsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      take: parseInt(req.query.take as string) || 5,
      page: parseInt(req.query.page as string) || 1,
      sortBy: (req.query.sortBy as string) || "createdAt",
      sortOrder: (req.query.sortOrder as string) || "asc",
      search: (req.query.search as string) || "",
      jobId: parseInt(req.query.jobId as string) || 0,
      educationLevel: (req.query.educationLevel as string) || "",
    };

    const result = await getJobApplicationsService(query);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getJobApplicationTotalController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      jobId: parseInt(req.query.jobId as string) || 0,
    };

    const result = await getJobApplicationsTotalService(query);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
