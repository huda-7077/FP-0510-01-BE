import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateCreateCompanyLocation = [
  body("regencyId")
    .notEmpty()
    .withMessage("Regency ID is required")
    .isInt()
    .withMessage("Regency ID must be a number"),

  body("address")
    .notEmpty()
    .withMessage("Address is required")
    .isString()
    .withMessage("Address must be a string")
    .isLength({ min: 5, max: 200 })
    .withMessage("Address must be between 5 and 200 characters"),

  body("postalCode")
    .notEmpty()
    .withMessage("Postal code is required")
    .matches(/^\d{5}$/)
    .withMessage("Postal code must be 5 digits"),

  body("latitude")
    .notEmpty()
    .withMessage("Latitude is required")
    .matches(/^-?\d+\.?\d*$/)
    .withMessage("Invalid latitude format"),

  body("longitude")
    .notEmpty()
    .withMessage("Longitude is required")
    .matches(/^-?\d+\.?\d*$/)
    .withMessage("Invalid longitude format"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }

    next();
  },
];
