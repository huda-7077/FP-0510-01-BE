import { Router } from "express";
import { verifyToken } from "../lib/jwt";
import {
  createSkillAssessmentQuestionController,
  deleteSkillAssessmentQuestionController,
  getSkillAssessmentQuestionsController,
  updateSkillAssessmentQuestionController,
} from "../controllers/skill-assessment-question.controller";
import { verifyRole } from "../middleware/role.middleware";

const router = Router();

router.get(
  "/:slug",
  verifyToken,
  verifyRole(["DEVELOPER", "USER"]),
  getSkillAssessmentQuestionsController
);
router.post(
  "/",
  verifyToken,
  verifyRole(["DEVELOPER"]),
  createSkillAssessmentQuestionController
);
router.patch(
  "/:id",
  verifyToken,
  verifyRole(["DEVELOPER"]),
  updateSkillAssessmentQuestionController
);

router.delete(
  "/:id",
  verifyToken,
  verifyRole(["DEVELOPER"]),
  deleteSkillAssessmentQuestionController
);

export default router;
