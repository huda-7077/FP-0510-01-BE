import { NextFunction, Request, Response } from "express";
import { startSkillAssessmentService } from "../services/skill-assessment-user-attempt/start-skill-assessment.service";
import { submitUserAnswersService } from "../services/skill-assessment-user-attempt/submit-user-answer.service";
import { getUserScoreService } from "../services/skill-assessment-user-attempt/get-user-score.service";
import { saveUserAnswerService } from "../services/skill-assessment-user-attempt/save-user-answer.service";
import { autoSubmitUserAnswersService } from "../services/skill-assessment-user-attempt/auto-submit-user-answer.service";
import { getUserAttemptService } from "../services/skill-assessment-user-attempt/get-user-attempt.service";

export const getUserScoreController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(res.locals.user.id);
    const attemptId = parseInt(req.params.attemptId);
    const result = await getUserScoreService(id, attemptId);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getUserAttemptController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(res.locals.user.id);
    const slug = req.params.slug;
    const result = await getUserAttemptService(id, slug);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const startSkillAssessmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(res.locals.user.id);
    const slug = req.params.slug;
    const result = await startSkillAssessmentService(id, slug);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const saveUserAnswerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(res.locals.user.id);
    const attemptId = parseInt(req.params.attemptId);
    const { questionId, selectedOptionId } = req.body;
    const result = await saveUserAnswerService(
      id,
      attemptId,
      parseInt(questionId),
      parseInt(selectedOptionId)
    );
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const autoSubmitUserAnswersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(res.locals.user.id);
    const attemptId = parseInt(req.params.attemptId);
    const result = await autoSubmitUserAnswersService(id, attemptId);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const submitUserAnswersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(res.locals.user.id);
    const attemptId = parseInt(req.params.attemptId);
    const result = await submitUserAnswersService(id, attemptId);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
