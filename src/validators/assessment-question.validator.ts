import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateCreateAssessmentQuestion = [
  body("assessmentId").notEmpty().withMessage("Assessment Id is required"),
  body("question").notEmpty().withMessage("Question is required").isString(),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }

    next();
  },
];

export const validateCreateAssessmentQuestions = [
  body("assessmentId").notEmpty().withMessage("Assessment Id is required"),

  body("questions")
    .isArray({ min: 1 })
    .withMessage("Questions must be an array with at least one question")
    .custom((questions) => {
      questions.forEach((question: string, index: number) => {
        if (typeof question !== "string" || question.trim() === "") {
          throw new Error(
            `Question at index ${index} must be a non-empty string`
          );
        }
      });
      return true;
    }),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }

    next();
  },
];
