import { Router } from "express";
import {
  createAssessmentController,
  getAssessmentController,
  getAssessmentSlugByJobIdController,
  updateAssessmentController,
  updatePreTestAssessmentStatusController,
} from "../controllers/assessment.controller";
import { verifyToken } from "../lib/jwt";
import { verifyRole } from "../middleware/role.middleware";
import {
  validateCreateAssessment,
  validateUpdateAssessment,
} from "../validators/assessment.validator";

const router = Router();

router.get(
  "/:slug",
  verifyToken,
  verifyRole(["ADMIN", "USER"]),
  getAssessmentController
);

router.get(
  "/",
  verifyToken,
  verifyRole(["USER"]),
  getAssessmentSlugByJobIdController
);

router.post(
  "/",
  verifyToken,
  verifyRole(["ADMIN"]),
  validateCreateAssessment,
  createAssessmentController
);
router.patch(
  "/:slug",
  verifyToken,
  verifyRole(["ADMIN"]),
  validateUpdateAssessment,
  updateAssessmentController
);
router.patch(
  "/:slug/status",
  verifyToken,
  verifyRole(["ADMIN"]),
  updatePreTestAssessmentStatusController
);

export default router;
