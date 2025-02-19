import { Router } from "express";
import { verifyToken } from "../lib/jwt";
import {
  getSkillAssessmentUserScoreController,
  submitSkillAssessmentUserAnswerController,
} from "../controllers/skill-assessment-user-answer.controller";
import { verifyRole } from "../middleware/role.middleware";

const router = Router();

router.get(
  "/:slug",
  verifyToken,
  verifyRole(["USER"]),
  getSkillAssessmentUserScoreController
);

router.post(
  "/",
  verifyToken,
  verifyRole(["USER"]),
  submitSkillAssessmentUserAnswerController
);

export default router;
