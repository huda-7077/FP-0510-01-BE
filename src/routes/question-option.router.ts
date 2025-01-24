import { Router } from "express";
import {
  createQuestionOptionsController,
  getQuestionOptionsController,
} from "../controllers/question-option.controller";
import { validateCreateQuestionOptions } from "../validators/question-option.validator";

const router = Router();

// Don't forget to add the verifyToken later!
router.get("/", getQuestionOptionsController);
router.post(
  "/bulk",
  validateCreateQuestionOptions,
  createQuestionOptionsController
);

export default router;
