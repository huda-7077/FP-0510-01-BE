import { Router } from "express";
import {
  createSkillAssessmentController,
  getSkillAssessmentController,
  getSkillAssessmentsController,
  updateSkillAssessmentController,
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

router.get(
  "/",
  verifyToken,
  verifyRole(["DEVELOPER", "USER"]),
  getSkillAssessmentsController
);
router.get(
  "/:slug",
  verifyToken,
  verifyRole(["DEVELOPER", "USER"]),
  getSkillAssessmentController
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

export default router;
