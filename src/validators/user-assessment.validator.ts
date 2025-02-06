import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateCreateUserAssessment = [
  body("assessmentId").notEmpty().withMessage("Assessment Id is required"),
  body("userId").notEmpty().withMessage("User Id is required"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }

    next();
  },
];

export const validateUpdateUserAssessment = [
  body("status").notEmpty().withMessage("Status is required").isString(),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }

    next();
  },
];
