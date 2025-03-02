import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateCreateCompanyReview = [
  body("salaryEstimate")
    .isNumeric()
    .notEmpty()
    .withMessage("Salary Estimate is required"),
  body("workCultureRating")
    .isNumeric()
    .notEmpty()
    .withMessage("Work Culture Rating is required")
    .matches(/^[0-5]$/, "i")
    .withMessage("Work Culture Rating must be between 0 and 5"),
  body("workLifeBalanceRating")
    .isNumeric()
    .notEmpty()
    .withMessage("Work Life Balance Rating is required")
    .matches(/^[0-5]$/, "i")
    .withMessage("Work Life Balance Rating must be between 0 and 5"),
  body("facilitiesRating")
    .isNumeric()
    .notEmpty()
    .withMessage("Facilities Rating is required")
    .matches(/^[0-5]$/, "i")
    .withMessage("Facilities Rating must be between 0 and 5"),
  body("careerGrowthRating")
    .isNumeric()
    .notEmpty()
    .withMessage("Career Growth Rating is required")
    .matches(/^[0-5]$/, "i")
    .withMessage("Career Growth Rating must be between 0 and 5"),
  body("comment").isString().notEmpty().withMessage("Comment is required"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }

    next();
  },
];
