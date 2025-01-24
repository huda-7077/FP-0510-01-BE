import { NextFunction, Request, Response } from "express";
import { createAssessmentService } from "../services/assessment/create-assessment.service";
import { deleteAssessmentService } from "../services/assessment/delete-assessment.service";
import { getAssessmentService } from "../services/assessment/get-assessment.service";
import { getAssessmentsService } from "../services/assessment/get-assessments.service";

export const getAssessmentsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      jobId: parseInt(req.query.jobId as string) || 0,
    };

    const result = await getAssessmentsService(query);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getAssessmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await getAssessmentService(parseInt(id));
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const createAssessmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await createAssessmentService(req.body);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const deleteAssessmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await deleteAssessmentService(req.body);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
