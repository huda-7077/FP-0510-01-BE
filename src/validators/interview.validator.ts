import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateCreateInterview = [
  body("jobApplicationId")
    .notEmpty()
    .withMessage("Job Applicatoin ID is required"),
  body("scheduledDate")
    .notEmpty()
    .withMessage("Scheduled Date is required")
    .isISO8601()
    .withMessage("Scheduled Date must be a valid ISO 8601 date"),
  body("interviewerName")
    .notEmpty()
    .withMessage("Interviewer Name is required")
    .isString(),
  body("location").notEmpty().withMessage("Location is required").isString(),
  body("meetingLink").optional().isString(),
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

export const validateUpdateInterview = [
  body("jobApplicationId")
    .notEmpty()
    .withMessage("Job Applicatoin ID is required"),
  body("scheduledDate")
    .notEmpty()
    .withMessage("Scheduled Date is required")
    .isISO8601()
    .withMessage("Scheduled Date must be a valid ISO 8601 date"),
  body("interviewerName")
    .notEmpty()
    .withMessage("Interviewer Name is required")
    .isString(),
  body("location").notEmpty().withMessage("Location is required").isString(),
  body("meetingLink").optional().isString(),
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
