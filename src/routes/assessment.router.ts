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
import { verifyToken } from "../lib/jwt";
import { verifyRole } from "../middleware/role.middleware";

const router = Router();

router.get("/", getAssessmentsController);
router.get("/:id", getAssessmentController);
router.post(
  "/",
  verifyToken,
  verifyRole("ADMIN"),
  validateCreateAssessment,
  createAssessmentController
);
router.patch(
  "/:id",
  verifyToken,
  verifyRole("ADMIN"),
  validateUpdateAssessment,
  updateAssessmentController
);
router.delete(
  "/:id",
  verifyToken,
  verifyRole("ADMIN"),
  deleteAssessmentController
);

export default router;
