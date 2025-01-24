import { Router } from "express";
import {
  createAssessmentController,
  deleteAssessmentController,
  getAssessmentController,
  getAssessmentsController,
} from "../controllers/assessment.controller";
import { validateCreateAssessment } from "../validators/assessment.validator";

const router = Router();

// router.post("/", verifyToken, validateCreateAssessment, createAssessmentController);
router.get("/", getAssessmentsController);
router.get("/:id", getAssessmentController);
router.post("/", validateCreateAssessment, createAssessmentController);
router.delete("/:id", deleteAssessmentController);

export default router;
