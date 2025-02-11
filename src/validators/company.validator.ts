import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateUpdateCompanyProfile = [
  body("name").notEmpty().withMessage("Company name is required").isString(),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("industry")
    .optional()
    .isString()
    .withMessage("Industry must be a string"),
  body("employeeCount")
    .optional()
    .isInt()
    .withMessage("Employee count must be a number"),
  body("establishedYear")
    .optional()
    .isInt()
    .withMessage("Established year must be a number"),
  body("links").optional().isString().withMessage("Links must be a string"),
  body("about").optional().isString().withMessage("About must be a string"),
  body("phoneNumber")
    .optional()
    .isString()
    .withMessage("Phone number must be a string"),
  body("logo").custom((value, { req }) => {
    if (!req.files?.logo) return true;

    const logo = req.files.logo[0];
    const allowedMimes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSize = 1 * 1024 * 1024; 

    if (!allowedMimes.includes(logo.mimetype)) {
      throw new Error("Logo must be in JPG, JPEG, or PNG format");
    }

    if (logo.size > maxSize) {
      throw new Error("Logo size must not exceed 1MB");
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
