import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateCreateSavedJob = [
  body("jobId")
    .notEmpty()
    .withMessage("Job ID is required")
    .isInt()
    .withMessage("Job ID must be an integer"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }
    next();
  },
];
