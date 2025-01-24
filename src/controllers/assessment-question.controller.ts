import { NextFunction, Request, Response } from "express";
import { createAssessmentQuestionService } from "../services/assessment-questions/create-assessment-question.service";
import { createAssessmentQuestionsService } from "../services/assessment-questions/create-assessment-questions.service";
import { getAssessmentQuestionsService } from "../services/assessment-questions/get-assessment-questions.service";

export const getAssessmentQuestionsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      assessmentId: parseInt(req.query.assessmentId as string) || 0,
    };

    const result = await getAssessmentQuestionsService(query);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const createAssessmentQuestionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await createAssessmentQuestionService(req.body);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const createAssessmentQuestionsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await createAssessmentQuestionsService(req.body);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
