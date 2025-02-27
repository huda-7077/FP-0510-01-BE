import { Router } from "express";
import { verifyToken } from "../lib/jwt";
import { verifyRole } from "../middleware/role.middleware";
import {
  autoSubmitUserAnswersController,
  getUserAttemptController,
  getUserScoreController,
  saveUserAnswerController,
  startAssessmentController,
  submitUserAnswersController,
} from "../controllers/assessment-user-attempt.controller";

const router = Router();

router.get("/", verifyToken, verifyRole(["USER"]), getUserAttemptController);
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
  startAssessmentController
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
