import { Router } from "express";
import { createSkillAssessmentController } from "../controllers/skill-assessment.controller";
import { imageFilter } from "../lib/fileFilter";
import { verifyToken } from "../lib/jwt";
import { uploader } from "../lib/multer";
import { verifyRole } from "../middleware/role.middleware";
import { validateCreateSkillAssessment } from "../validators/skill-assessment.validator";

const router = Router();

router.post(
  "/",
  verifyToken,
  verifyRole(["DEVELOPER"]),
  uploader(1).fields([{ name: "badgeImage", maxCount: 1 }]),
  imageFilter,
  validateCreateSkillAssessment,
  createSkillAssessmentController
);

export default router;
