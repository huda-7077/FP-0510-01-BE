import { Router } from "express";
import {
  createAssessmentController,
  deleteAssessmentController,
  getAssessmentController,
  getAssessmentsController,
  updateAssessmentController,
} from "../controllers/assessment.controller";
import {
  validateCreateAssessment,
  validateUpdateAssessment,
} from "../validators/assessment.validator";

const router = Router();

//! Don't forget to add the verifyToken later!
// router.post("/", verifyToken, validateCreateAssessment, createAssessmentController);
router.get("/", getAssessmentsController);
router.get("/:id", getAssessmentController);
router.post("/", validateCreateAssessment, createAssessmentController);
router.patch("/:id", validateUpdateAssessment, updateAssessmentController);
router.delete("/:id", deleteAssessmentController);

export default router;
