import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateCreateJob = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string"),

  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string"),

  body("bannerImage")
    .optional()
    .isString()
    .withMessage("Banner Image must be a string"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isString()
    .withMessage("Category must be a string"),

  body("salary").optional().isInt().withMessage("Salary must be an integer"),

  body("tags").optional().isString().withMessage("Tags must be a string"),

  body("applicationDeadline")
    .notEmpty()
    .withMessage("Application Deadline is required")
    .isISO8601()
    .withMessage("Application Deadline must be a valid ISO 8601 date"),

  body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("Is Published must be a boolean"),

  body("requiresAssessment")
    .notEmpty()
    .withMessage("Requires Assessment is required")
    .isBoolean()
    .withMessage("Requires Assessment must be a boolean"),

  body("isDeleted")
    .optional()
    .isBoolean()
    .withMessage("Is Deleted must be a boolean"),

  body("companyLocationId")
    .notEmpty()
    .withMessage("Company Location Id is required")
    .isInt()
    .withMessage("Company Location Id must be an integer"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }
    next();
  },
];

export const validateUpdateJob = [
  body("title").optional().isString().withMessage("Title must be a string"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("bannerImage")
    .optional()
    .isString()
    .withMessage("Banner Image must be a string"),

  body("category")
    .optional()
    .isString()
    .withMessage("Category must be a string"),

  body("salary").optional(),

  body("applicationDeadline")
    .optional()
    .isISO8601()
    .withMessage("Application Deadline must be a valid ISO 8601 date"),

  body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("Is Published must be a boolean"),

  body("requiresAssessment")
    .optional()
    .isBoolean()
    .withMessage("Requires Assessment must be a boolean"),

  body("isDeleted")
    .optional()
    .isBoolean()
    .withMessage("Is Deleted must be a boolean"),

  body("companyLocationId")
    .optional()
    .isInt()
    .withMessage("Company Location Id must be an integer"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }
    next();
  },
];
