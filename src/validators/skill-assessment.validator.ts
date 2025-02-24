import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateCreateSkillAssessment = [
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
  body("badgeImage").custom((value, { req }) => {
    if (!req.files || !req.files.badgeImage) {
      throw new Error("Badge Image is required");
    }
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

export const validateUpdateSkillAssessment = [
  body("title").isString().optional().withMessage("Title must be a string"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("passingScore")
    .optional()
    .isNumeric()
    .withMessage("Passing Score must be a number"),
  body("badgeImage")
    .optional()
    .custom((value, { req }) => {
      if (!req.files || !req.files.badgeImage) {
        throw new Error("Badge Image is required");
      }
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
