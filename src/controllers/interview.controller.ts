import { NextFunction, Request, Response } from "express";
import { getInterviewsService } from "../services/interview-schedule/get-interviews.service";
import { createInterviewService } from "../services/interview-schedule/create-interview.service";
import { updateInterviewService } from "../services/interview-schedule/update-interview.service";
import { getInterviewService } from "../services/interview-schedule/get-interview.service";

export const getInterviewsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      take: parseInt(req.query.take as string) || 3,
      page: parseInt(req.query.page as string) || 1,
      sortBy: (req.query.sortBy as string) || "createdAt",
      sortOrder: (req.query.sortOrder as string) || "asc",
      search: (req.query.search as string) || "",
    };

    const userId = res.locals.user.id;

    const result = await getInterviewsService(query, Number(userId));
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getInterviewController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = res.locals.user.id;
    const result = await getInterviewService(parseInt(id), userId);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const createInterviewController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.id;
    const result = await createInterviewService(userId, req.body);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const updateInterviewController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = res.locals.user.id;
    const result = await updateInterviewService(req.body, userId, parseInt(id));
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
