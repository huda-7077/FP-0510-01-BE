import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateCreateSubscriptionCategory = [
  body("name").notEmpty().withMessage("Name is required"),
  body("price").notEmpty().withMessage("Price is required").isNumeric(),
  body("features")
    .isArray()
    .withMessage("Features is required and must be an array"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }

    next();
  },
];
