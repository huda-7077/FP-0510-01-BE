import { Router } from "express";
import {
  createAssessmentQuestionController,
  createAssessmentQuestionsController,
  deleteAssessmentQuestionController,
  getAssessmentQuestionCountController,
  getAssessmentQuestionsController,
  updateAssessmentQuestionController,
} from "../controllers/assessment-question.controller";
import {
  validateCreateAssessmentQuestion,
  validateCreateAssessmentQuestions,
  validateUpdateAssessmentQuestion,
} from "../validators/assessment-question.validator";
import { verifyToken } from "../lib/jwt";
import { verifyRole } from "../middleware/role.middleware";

const router = Router();

//! Don't forget to add the verifyToken later!
router.get("/", getAssessmentQuestionsController);
router.get("/count/:id", getAssessmentQuestionCountController);
router.post(
  "/",
  verifyToken,
  verifyRole(["ADMIN"]),
  validateCreateAssessmentQuestion,
  createAssessmentQuestionController
);

router.post(
  "/bulk",
  verifyToken,
  verifyRole(["ADMIN"]),
  validateCreateAssessmentQuestions,
  createAssessmentQuestionsController
);

router.patch(
  "/:id",
  verifyToken,
  verifyRole(["ADMIN"]),
  validateUpdateAssessmentQuestion,
  updateAssessmentQuestionController
);

router.delete(
  "/:id",
  verifyToken,
  verifyRole(["ADMIN"]),
  deleteAssessmentQuestionController
);

export default router;
