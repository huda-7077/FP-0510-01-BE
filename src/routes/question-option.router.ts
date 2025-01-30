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

const router = Router();

// Don't forget to add the verifyToken later!
router.get("/", getQuestionOptionsController);
router.post(
  "/bulk",
  validateCreateQuestionOptions,
  createQuestionOptionsController
);
router.patch(
  "/filter/questionId/:id",
  //! add validator,
  updateQuestionOptionByQuestionIdController
);
router.delete("/:id", deleteQuestionOptionController);
router.delete(
  "/filter/questionId/:id",
  deleteQuestionOptionsByQuestionIdController
);

export default router;
