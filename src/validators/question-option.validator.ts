import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateCreateQuestionOptions = [
  body("questionId").notEmpty().withMessage("Question Id is required"),

  body("options")
    .isArray({ min: 1 })
    .withMessage("Options must be an array with at least one option")
    .custom((options) => {
      options.forEach((option: string, index: number) => {
        if (typeof option !== "string" || option.trim() === "") {
          throw new Error(
            `Option at index ${index} must be a non-empty string`
          );
        }
      });
      return true;
    }),

  body("isCorrect")
    .isArray()
    .withMessage("isCorrect must be an array")
    .custom((isCorrect, { req }) => {
      if (isCorrect.length !== req.body.options.length) {
        throw new Error(
          "isCorrect array must have the same length as options array"
        );
      }
      isCorrect.forEach((value: boolean, index: number) => {
        if (typeof value !== "boolean") {
          throw new Error(`isCorrect at index ${index} must be a boolean`);
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

export const validateUpdateQuestionOption = [
  body("option")
    .optional()
    .notEmpty()
    .withMessage("Option is required")
    .isString(),
  body("isCorrect")
    .optional()
    .notEmpty()
    .withMessage("isCorrect is required")
    .isBoolean(),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }

    next();
  },
];
