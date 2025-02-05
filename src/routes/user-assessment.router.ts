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
import { verifyToken } from "../lib/jwt";
import { verifyRole } from "../middleware/role.middleware";

const router = Router();

router.get("/", getUserAssessmentsController);
router.get("/:id", getUserAssessmentController);
router.post(
  "/",
  verifyToken,
  verifyRole("USER"),
  validateCreateUserAssessment,
  createUserAssessmentController
);
router.patch(
  "/:id",
  verifyToken,
  verifyRole("USER"),
  validateUpdateUserAssessment,
  updateUserAssessmentController
);

export default router;
