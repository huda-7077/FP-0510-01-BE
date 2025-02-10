import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateCreateWorkExperience = [
  body("companyName")
    .notEmpty()
    .withMessage("Company name is required")
    .isString()
    .withMessage("Company name must be text"),

  body("jobTitle")
    .notEmpty()
    .withMessage("Job title is required")
    .isString()
    .withMessage("Job title must be text"),

  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Start date must be a valid date"),

  body("endDate")
    .if(body("isCurrentJob").equals("false"))
    .notEmpty()
    .withMessage("End date is required when not current job")
    .isISO8601()
    .withMessage("End date must be a valid date")
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.startDate)) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),

  body("isCurrentJob")
    .isBoolean()
    .withMessage("Current job status must be true or false"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be text"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }
    next();
  },
];
