import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateUpdateProfile = [
  body("fullName")
    .notEmpty()
    .withMessage("Full name is required")
    .isString()
    .withMessage("Full name must be a string")
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters"),

  body("headline")
    .optional()
    .isString()
    .withMessage("Headline must be a string")
    .isLength({ max: 200 })
    .withMessage("Headline must not exceed 200 characters"),

  body("dateOfBirth")
    .optional()
    .isISO8601()
    .withMessage("Date of birth must be a valid date")
    .custom((value) => {
      const date = new Date(value);
      const now = new Date();
      const minAge = new Date(now.setFullYear(now.getFullYear() - 15)); // Minimum age 15
      if (date > minAge) {
        throw new Error("User must be at least 15 years old");
      }
      return true;
    }),

  body("gender")
    .optional()
    .isIn(["MALE", "FEMALE"])
    .withMessage("Gender must be either MALE or FEMALE"),

  body("educationLevel")
    .optional()
    .isString()
    .withMessage("Education level must be a string")
    .isLength({ max: 50 })
    .withMessage("Education level must not exceed 50 characters"),

  body("currentAddress")
    .optional()
    .isString()
    .withMessage("Current address must be a string")
    .isLength({ max: 255 })
    .withMessage("Current address must not exceed 255 characters"),

  body("phoneNumber")
    .optional()
    .isString()
    .withMessage("Phone number must be a string")
    .matches(/^[+]?[\d\s-]+$/)
    .withMessage("Invalid phone number format")
    .isLength({ min: 10, max: 15 })
    .withMessage("Phone number must be between 10 and 15 characters"),

  body("skills")
    .optional()
    .custom((value) => {
      if (typeof value === "string") {
        const skills = value.split(",").map((skill) => skill.trim());
        return skills.every((skill) => skill.length > 0 && skill.length <= 50);
      } else if (Array.isArray(value)) {
        return value.every(
          (skill) =>
            typeof skill === "string" && skill.length > 0 && skill.length <= 50
        );
      }
      return false;
    })
    .withMessage(
      "Skills must be a comma-separated string or array of strings, each skill must not exceed 50 characters"
    ),

  body("regencyId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Regency ID must be a positive integer"),
];

export const validateFileUploads = (req: any, res: any, next: any) => {
  const errors: string[] = [];

  if (req.files?.profilePicture?.[0]) {
    const file = req.files.profilePicture[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSize = 1 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.mimetype)) {
      errors.push("Profile picture must be JPEG, PNG, or JPG");
    }
    if (file.size > maxSize) {
      errors.push("Profile picture must not exceed 5MB");
    }
  }

  if (req.files?.cvUrl?.[0]) {
    const file = req.files.cvUrl[0];
    const allowedTypes = ["application/pdf"];
    const maxSize = 1 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.mimetype)) {
      errors.push("CV must be a PDF file");
    }
    if (file.size > maxSize) {
      errors.push("CV must not exceed 10MB");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export const validateChangeEmail = [
  body("email")
    .notEmpty()
    .withMessage("New email is required")
    .isEmail()
    .withMessage("Please enter a valid email"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }

    next();
  },
];

export const validateChangePassword = [
  body("password").notEmpty().withMessage("Password is required"),
  body("newPassword").notEmpty().withMessage("New Password is required"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }

    next();
  },
];
