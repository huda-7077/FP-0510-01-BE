import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateCreateJobApplication = [
  body("jobId")
    .notEmpty()
    .withMessage("Job ID is required")
    .isInt()
    .withMessage("Job ID must be a number"),
  body("expectedSalary")
    .notEmpty()
    .withMessage("Expected salary is required")
    .isInt()
    .withMessage("Expected salary must be a number"),
  body("useExistingCV")
    .optional()
    .isBoolean()
    .withMessage("useExistingCV must be a boolean"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }

    next();
  },
];

export const validateUpdateJobApplication = [
  body("jobId").optional().isNumeric(),
  body("userId").optional().isNumeric(),
  body("cvFile").optional().isString(),
  body("attachment").optional().isString(),
  body("expectedSalary").optional().isNumeric(),
  body("status").optional().isString(),
  body("notes").optional().isString(),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }

    next();
  },
];
