import { NextFunction, Request, Response } from "express";
import { createUserAssessmentService } from "../services/user-assessment/create-user-assessment.service";
import { getUserAssessmentService } from "../services/user-assessment/get-assessment.service";
import { getUserAssessmentsService } from "../services/user-assessment/get-user-assessments.service";
import { updateUserAssessmentService } from "../services/user-assessment/update-user-assessment.service";

export const getUserAssessmentsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      assessmentId: parseInt(req.query.assessmentId as string),
      userId: parseInt(req.query.userId as string),
    };

    const result = await getUserAssessmentsService(query);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getUserAssessmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await getUserAssessmentService(parseInt(id));
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const createUserAssessmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(res.locals.user.id);
    const result = await createUserAssessmentService(userId, req.body);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const updateUserAssessmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await updateUserAssessmentService(parseInt(id), req.body);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
