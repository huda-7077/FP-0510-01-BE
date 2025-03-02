import { NextFunction, Request, Response } from "express";
import { createSavedJobService } from "../services/saved-job/create-saved-job.service";
import { deleteSavedJobService } from "../services/saved-job/delete-saved-job.service";
import { getSavedJobsService } from "../services/saved-job/get-saved-jobs.service";

export const createSavedJobController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user.id;
    const { jobId } = req.body;

    if (!jobId) {
      res.status(400).send({
        status: "error",
        message: "Job ID is required",
      });
      return;
    }

    const result = await createSavedJobService(userId, parseInt(jobId));

    res.status(201).send({
      status: "success",
      message: "Job bookmarked successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getSavedJobsController = async (
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
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
    };

    const userId = res.locals.user.id;

    const result = await getSavedJobsService(query, userId);

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const deleteSavedJobController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user.id;
    const { id } = req.params;

    if (!id) {
      res.status(400).send({
        status: "error",
        message: "Job ID is required",
      });
      return;
    }

    const result = await deleteSavedJobService(userId, parseInt(id));

    res.status(200).send({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};
