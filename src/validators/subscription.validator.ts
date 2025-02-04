import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateCreateSubscription = [
  body("uuid").notEmpty().withMessage("UUID is required").isString(),
  body("action")
    .isIn(["ACCEPTED", "REJECTED"])
    .withMessage("Action must be ACCEPTED or REJECTED"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }

    next();
  },
];
