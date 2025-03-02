import { NextFunction, Request, Response } from "express";
import { createAssessmentQuestionService } from "../services/assessment-questions/create-assessment-question.service";
import { getAssessmentQuestionsService } from "../services/assessment-questions/get-assessment-questions.service";
import { updateAssessmentQuestionService } from "../services/assessment-questions/update-assessment-question.service";
import { deleteAssessmentQuestionService } from "../services/assessment-questions/delete-assessment-question.service";

export const getAssessmentQuestionsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const slug = req.params.slug;
    const role = res.locals.user.role;

    const result = await getAssessmentQuestionsService(slug, role);
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
    const companyId = res.locals.user.companyId;

    const result = await createAssessmentQuestionService(req.body, companyId);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const updateAssessmentQuestionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const companyId = res.locals.user.companyId;
    const result = await updateAssessmentQuestionService(
      {
        id: parseInt(id),
        ...req.body,
      },
      companyId
    );
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const deleteAssessmentQuestionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const companyId = res.locals.user.companyId;
    const result = await deleteAssessmentQuestionService(
      parseInt(id),
      companyId
    );
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
