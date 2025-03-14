import { Router } from "express";
import {
  createSkillAssessmentController,
  getSkillAssessmentController,
  getSkillAssessmentsController,
  getSkillAssessmentsPublicController,
  updateSkillAssessmentController,
  updateSkillAssessmentStatusController,
} from "../controllers/skill-assessment.controller";
import { imageFilter } from "../lib/fileFilter";
import { verifyToken } from "../lib/jwt";
import { uploader } from "../lib/multer";
import { verifyRole } from "../middleware/role.middleware";
import {
  validateCreateSkillAssessment,
  validateUpdateSkillAssessment,
} from "../validators/skill-assessment.validator";

const router = Router();

router.get("/", getSkillAssessmentsPublicController);
router.get(
  "/:slug",
  verifyToken,
  verifyRole(["DEVELOPER", "USER"]),
  getSkillAssessmentController
);
router.get(
  "/developer/data",
  verifyToken,
  verifyRole(["DEVELOPER"]),
  getSkillAssessmentsController
);
router.post(
  "/",
  verifyToken,
  verifyRole(["DEVELOPER"]),
  uploader(1).fields([{ name: "badgeImage", maxCount: 1 }]),
  imageFilter,
  validateCreateSkillAssessment,
  createSkillAssessmentController
);
router.patch(
  "/:slug",
  verifyToken,
  verifyRole(["DEVELOPER"]),
  uploader(1).fields([{ name: "badgeImage", maxCount: 1 }]),
  imageFilter,
  validateUpdateSkillAssessment,
  updateSkillAssessmentController
);
router.patch(
  "/:slug/status",
  verifyToken,
  verifyRole(["DEVELOPER"]),
  updateSkillAssessmentStatusController
);

export default router;
