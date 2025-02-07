import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateUpdateJobApplication = [
  body("jobId").optional().isNumeric(),
  body("userId").optional().isNumeric(),
  body("cvFile").optional().isString(),
  body("attachment").optional().isString(),
  body("expectedSalary").optional().isNumeric(),
  body("status").optional().isString(),
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
