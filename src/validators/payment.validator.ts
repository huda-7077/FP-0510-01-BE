import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateCreatePayment = [
  body("category").notEmpty().withMessage("Category is required").isString(),
  body("paymentMethod")
    .isIn(["PAYMENT_MANUAL", "PAYMENT_GATEWAY"])
    .withMessage("Payment method must be PAYMENT_MANUAL or PAYMENT_GATEWAY"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }

    next();
  },
];
