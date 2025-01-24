import { Router } from "express";
import {
  createAssessmentQuestionController,
  createAssessmentQuestionsController,
  getAssessmentQuestionsController,
} from "../controllers/assessment-question.controller";
import {
  validateCreateAssessmentQuestion,
  validateCreateAssessmentQuestions,
} from "../validators/assessment-question.validator";

const router = Router();

// Don't forget to add the verifyToken later!
router.get("/", getAssessmentQuestionsController);
router.post(
  "/",
  validateCreateAssessmentQuestion,
  createAssessmentQuestionController
);

router.post(
  "/bulk",
  validateCreateAssessmentQuestions,
  createAssessmentQuestionsController
);

export default router;
