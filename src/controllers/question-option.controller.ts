import { NextFunction, Request, Response } from "express";
import { createQuestionOptionsService } from "../services/question-options/create-question-options.service";
import { getQuestionOptionsService } from "../services/question-options/get-question-options.service";
import { deleteQuestionOptionService } from "../services/question-options/delete-question-option.service";
import { deleteQuestionOptionsByQuestionIdService } from "../services/question-options/delete-question-options-by-questionId";
import { updateQuestionOptionByQuestionIdService } from "../services/question-options/update-question-option-by-question-id.service";

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

export const updateQuestionOptionByQuestionIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await updateQuestionOptionByQuestionIdService(req.body, {
      questionId: parseInt(id),
    });
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const deleteQuestionOptionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const result = await deleteQuestionOptionService({
      id: parseInt(id),
    });
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const deleteQuestionOptionsByQuestionIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const result = await deleteQuestionOptionsByQuestionIdService({
      questionId: parseInt(id),
    });
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
