import { NextFunction, Request, Response } from "express";
import { getJobsService } from "../services/job/get-jobs.service";
import { getJobService } from "../services/job/get-job.service";
import { createJobService } from "../services/job/create-job.service";
import { updateJobService } from "../services/job/update-job.service";
import { updateJobStatusService } from "../services/job/update-job-status.service";
import { deleteJobService } from "../services/job/delete-job.service";
import { getCompanyJobsService } from "../services/job/get-company-jobs.service";
import {
  getPopularJobCategoriesService,
  TimeRange,
} from "../services/job/get-popular-job-categories.service";
import { getCompanyJobService } from "../services/job/get-company-job.service";

export const getJobsController = async (
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
      category: req.query.category as string,
      timeRange: req.query.timeRange as "week" | "month" | "custom",
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      location: req.query.location as string,
      companyId: parseInt(req.query.companyId as string),
      userLatitude: parseFloat(req.query.userLatitude as string) || undefined,
      userLongitude: parseFloat(req.query.userLongitude as string) || undefined,
      maxDistance: parseFloat(req.query.maxDistance as string) || 50,
    };

    const result = await getJobsService(query);

    res.status(200).send({
      status: "success",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const getCompanyJobsController = async (
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
      isDeleted: (req.query.isDeleted as string) || "",
      startDate: (req.query.startDate as string) || undefined,
      endDate: (req.query.endDate as string) || undefined,
    };

    const userId = res.locals.user.id;

    const result = await getCompanyJobsService(query, userId);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getJobController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params;
    const companyId = parseInt(req.query.companyId as string);
    const isPublished = req.query.isPublished === "true";
    const isExpired = req.query.isExpired === "true";
    const result = await getJobService(slug, companyId, isPublished, isExpired);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getCompanyJobController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = res.locals.user.id;
    const result = await getCompanyJobService(parseInt(id), userId);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getPopularJobCategoriesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const timeRange = (req.query.timeRange as TimeRange) || "Last 5 years";

    const result = await getPopularJobCategoriesService(timeRange);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const createJobController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const bannerImage = files?.bannerImage?.[0];
    const companyId = res.locals.user.companyId;

    const result = await createJobService(
      req.body,
      req.body.tags,
      companyId,
      bannerImage
    );
    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
};

export const updateJobController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const bannerImage = files?.bannerImage?.[0];
    const companyId = res.locals.user.companyId;

    const result = await updateJobService(
      Number(id),
      req.body,
      req.body.tags,
      companyId,
      req.body.generateSlug,
      bannerImage
    );
    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
};

export const updateJobStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const companyId = res.locals.user.companyId;
    const result = await updateJobStatusService(
      Number(id),
      companyId,
      req.body
    );
    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
};

export const deleteJobController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const companyId = res.locals.user.companyId;
    const result = await deleteJobService(Number(id), companyId);
    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
};
