import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateCreateAssessment = [
  body("jobId").notEmpty().withMessage("Job ID is required"),
  body("title").notEmpty().withMessage("Title is required").isString(),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isString(),
  body("passingScore")
    .notEmpty()
    .withMessage("Passing Score is required")
    .isNumeric()
    .withMessage("Passing Score must be a number"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }

    next();
  },
];

export const validateUpdateAssessment = [
  body("title")
    .optional()
    .notEmpty()
    .withMessage("Title is required")
    .isString(),
  body("description")
    .optional()
    .notEmpty()
    .withMessage("Description is required")
    .isString(),
  body("passingScore")
    .optional()
    .notEmpty()
    .withMessage("Passing Score is required")
    .isNumeric()
    .withMessage("Passing Score must be a number"),
  body("status")
    .optional()
    .notEmpty()
    .withMessage("Status is required")
    .isString(),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }

    next();
  },
];
