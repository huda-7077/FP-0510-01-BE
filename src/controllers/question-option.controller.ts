import { NextFunction, Request, Response } from "express";
import { createQuestionOptionsService } from "../services/question-options/create-question-options.service";
import { getQuestionOptionsService } from "../services/question-options/get-question-options.service";

export const getQuestionOptionsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      questionId: parseInt(req.query.questionId as string) || 0,
    };

    const result = await getQuestionOptionsService(query);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const createQuestionOptionsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await createQuestionOptionsService(req.body);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
