import { Router } from "express";
import {
  createAssessmentQuestionController,
  deleteAssessmentQuestionController,
  getAssessmentQuestionsController,
  updateAssessmentQuestionController,
} from "../controllers/assessment-question.controller";
import { verifyToken } from "../lib/jwt";
import { verifyRole } from "../middleware/role.middleware";

const router = Router();

router.get(
  "/:slug",
  verifyToken,
  verifyRole(["ADMIN", "USER"]),
  getAssessmentQuestionsController
);
router.post(
  "/",
  verifyToken,
  verifyRole(["ADMIN"]),
  createAssessmentQuestionController
);

router.patch(
  "/:id",
  verifyToken,
  verifyRole(["ADMIN"]),
  updateAssessmentQuestionController
);

router.delete(
  "/:id",
  verifyToken,
  verifyRole(["ADMIN"]),
  deleteAssessmentQuestionController
);

export default router;
