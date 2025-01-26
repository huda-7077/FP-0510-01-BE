import { Router } from "express";
import {
  createAssessmentQuestionController,
  createAssessmentQuestionsController,
  deleteAssessmentQuestionController,
  getAssessmentQuestionsController,
  updateAssessmentQuestionController,
} from "../controllers/assessment-question.controller";
import {
  validateCreateAssessmentQuestion,
  validateCreateAssessmentQuestions,
  validateUpdateAssessmentQuestion,
} from "../validators/assessment-question.validator";

const router = Router();

//! Don't forget to add the verifyToken later!
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

router.patch(
  "/:id",
  validateUpdateAssessmentQuestion,
  updateAssessmentQuestionController
);

router.delete("/:id", deleteAssessmentQuestionController);

export default router;
