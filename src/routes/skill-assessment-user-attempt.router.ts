import { Router } from "express";
import {
  autoSubmitUserAnswersController,
  getUserAttemptController,
  getUserScoreController,
  saveUserAnswerController,
  startSkillAssessmentController,
  submitUserAnswersController,
} from "../controllers/skill-assessment-user-attempt.controller";
import { verifyToken } from "../lib/jwt";
import { verifyRole } from "../middleware/role.middleware";

const router = Router();

router.get(
  "/:slug",
  verifyToken,
  verifyRole(["USER"]),
  getUserAttemptController
);
router.get(
  "/:attemptId/score",
  verifyToken,
  verifyRole(["USER"]),
  getUserScoreController
);
router.post(
  "/:slug",
  verifyToken,
  verifyRole(["USER"]),
  startSkillAssessmentController
);
router.patch(
  "/:attemptId",
  verifyToken,
  verifyRole(["USER"]),
  saveUserAnswerController
);
router.patch(
  "/:attemptId/submit",
  verifyToken,
  verifyRole(["USER"]),
  submitUserAnswersController
);
router.patch(
  "/:attemptId/auto-submit",
  verifyToken,
  verifyRole(["USER"]),
  autoSubmitUserAnswersController
);

export default router;
