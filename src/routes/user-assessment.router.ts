import { Router } from "express";
import {
  createUserAssessmentController,
  getUserAssessmentController,
  getUserAssessmentsController,
  updateUserAssessmentController,
} from "../controllers/user-assessment.controller";
import {
  validateCreateUserAssessment,
  validateUpdateUserAssessment,
} from "../validators/user-assessment.validator";

const router = Router();

router.get("/", getUserAssessmentsController);
router.get("/:id", getUserAssessmentController);
router.post("/", validateCreateUserAssessment, createUserAssessmentController);
router.patch(
  "/:id",
  validateUpdateUserAssessment,
  updateUserAssessmentController
);

export default router;
