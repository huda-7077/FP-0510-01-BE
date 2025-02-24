import { NextFunction, Request, Response } from "express";
import { createSkillAssessmentQuestionService } from "../services/skill-assessment-question/create-skill-assessment-question.service";
import { updateSkillAssessmentQuestionService } from "../services/skill-assessment-question/update-skill-assessment-question.service";
import { getSkillAssessmentQuestionsService } from "../services/skill-assessment-question/get-skill-assessment-questions.service";
import { deleteSkillAssessmentQuestionService } from "../services/skill-assessment-question/delete-skill-assessment-question.service";

export const getSkillAssessmentQuestionsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const slug = req.params.slug;
    const role = res.locals.user.role;
    const result = await getSkillAssessmentQuestionsService(slug, role);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const createSkillAssessmentQuestionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await createSkillAssessmentQuestionService(req.body);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const updateSkillAssessmentQuestionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await updateSkillAssessmentQuestionService({
      id: parseInt(id),
      ...req.body,
    });
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const deleteSkillAssessmentQuestionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await deleteSkillAssessmentQuestionService(parseInt(id));
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
