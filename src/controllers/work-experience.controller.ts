import { NextFunction, Request, Response } from "express";
import { createWorkExperienceService } from "../services/work-experience/create-work-experience.service";
import { getWorkExperiencesService } from "../services/work-experience/get-work-experiences.service";
import { deleteWorkExperienceService } from "../services/work-experience/delete-work.experience.service";

export const createWorkExperienceController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(res.locals.user.id);
    const result = await createWorkExperienceService(userId, req.body);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getWorkExperiencesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(res.locals.user.id);
    const result = await getWorkExperiencesService(userId);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const deleteWorkExperienceController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = Number(res.locals.user.id);

    if (req.body.ids) {
      const result = await deleteWorkExperienceService(userId, req.body.ids);
      res.status(200).json(result);
      return;
    }

    const experienceId = Number(req.params.id);
    const result = await deleteWorkExperienceService(userId, [experienceId]);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
