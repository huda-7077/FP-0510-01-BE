import { NextFunction, Request, Response } from "express";
import { getJobsService } from "../services/job/get-jobs.service";
import { getJobCategoriesService } from "../services/job/get-jobs-categories.service";
import { getJobService } from "../services/job/get-job.service";
import { createJobService } from "../services/job/create-job.service";
import { updateJobService } from "../services/job/update-job.service";
import { updateJobStatusService } from "../services/job/update-job-status.service";
import { deleteJobService } from "../services/job/delete-job.service";
import { getCompanyJobsService } from "../services/job/get-company-jobs.service";

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
      isPublished: (req.query.isPublished as string) || "",
      isDeleted: (req.query.isDeleted as string) || "",
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
    const { id } = req.params;
    const companyId = parseInt(req.query.companyId as string);
    const result = await getJobService(parseInt(id), companyId);
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

export const createJobController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const bannerImage = files?.bannerImage?.[0];

    const result = await createJobService(req.body, req.body.tags, bannerImage);
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

    const result = await updateJobService(
      Number(id),
      req.body,
      req.body.tags,
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

    const result = await updateJobStatusService(Number(id), req.body);
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

    const result = await deleteJobService(Number(id));
    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
};
