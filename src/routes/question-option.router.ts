import { Router } from "express";
import {
  createQuestionOptionsController,
  deleteQuestionOptionController,
  deleteQuestionOptionsByQuestionIdController,
  getQuestionOptionsController,
  updateQuestionOptionByQuestionIdController,
} from "../controllers/question-option.controller";
import {
  validateCreateQuestionOptions,
  validateUpdateQuestionOption,
} from "../validators/question-option.validator";
import { verifyToken } from "../lib/jwt";
import { verifyRole } from "../middleware/role.middleware";

const router = Router();

// Don't forget to add the verifyToken later!
router.get("/", getQuestionOptionsController);
router.post(
  "/bulk",
  verifyToken,
  verifyRole(["ADMIN"]),
  validateCreateQuestionOptions,
  createQuestionOptionsController
);
router.patch(
  "/filter/questionId/:id",
  verifyToken,
  verifyRole(["ADMIN"]),
  //! add validator,
  updateQuestionOptionByQuestionIdController
);
router.delete(
  "/:id",
  verifyToken,
  verifyRole(["ADMIN"]),
  deleteQuestionOptionController
);
router.delete(
  "/filter/questionId/:id",
  verifyToken,
  verifyRole(["ADMIN"]),
  deleteQuestionOptionsByQuestionIdController
);

export default router;
