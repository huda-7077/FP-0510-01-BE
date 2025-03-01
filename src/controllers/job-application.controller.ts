import { NextFunction, Request, Response } from "express";
import { getJobApplicationsTotalService } from "../services/job-application/get-job-applications-total.service";
import { getJobApplicationsService } from "../services/job-application/get-job-applications.service";
import { updateJobApplicationService } from "../services/job-application/update-job-application.service";
import {
  getAvgSalaryByPositionService,
  TimeRange,
} from "../services/job-application/get-avg-salary-by-position";
import { getAvgSalaryByProvinceService } from "../services/job-application/get-avg-salary-by-location";
import { createJobApplicationService } from "../services/job-application/create-job-application.service";
import { getUserJobApplicationsService } from "../services/job-application/get-user-job-applications.service";
import { getJobApplicationService } from "../services/job-application/get-job-application.service";

export const createJobApplicationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as { [fieldName: string]: Express.Multer.File[] };
    const userId = res.locals.user.id;
    const result = await createJobApplicationService(userId, req.body, files);

    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
};

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

export const getJobApplicationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await getJobApplicationService(req.body, parseInt(id));
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

    const userId = res.locals.user.id;

    const result = await getJobApplicationsService(query, userId);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getUserJobApplicationsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      take: parseInt(req.query.take as string) || 10,
      page: parseInt(req.query.page as string) || 1,
      sortBy: (req.query.sortBy as string) || "createdAt",
      sortOrder: (req.query.sortOrder as "asc" | "desc") || "desc",
      search: req.query.search as string,
      status: req.query.status as string,
      category: req.query.category as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
    };
    const userId = res.locals.user.id;

    const result = await getUserJobApplicationsService(userId, query);

    res.status(200).send({
      status: "success",
      ...result,
    });
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

export const getAvgSalaryByPositionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const timeRange = (req.query.timeRange as TimeRange) || "All Time";

    const result = await getAvgSalaryByPositionService(timeRange);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getAvgSalaryByProvinceController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const timeRange = (req.query.timeRange as TimeRange) || "All Time";

    const result = await getAvgSalaryByProvinceService(timeRange);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
