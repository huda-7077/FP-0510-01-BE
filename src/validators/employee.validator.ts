import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateRegisterEmployee = [
  body("userId").notEmpty().withMessage("User ID is required"),
  body("position").notEmpty().withMessage("Position is required").isString(),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }

    next();
  },
];

export const validateUpdateEmployee = [
  body("userId").notEmpty().withMessage("User ID is required"),
  body("position").notEmpty().withMessage("Position is required").isString(),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }

    next();
  },
];
