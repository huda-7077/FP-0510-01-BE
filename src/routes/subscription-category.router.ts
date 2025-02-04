import { Router } from "express";
import {
  createSubscriptionCategoryController,
  getSubscriptionCategoriesController,
} from "../controllers/subscription-category.controller";
import { validateCreateSubscriptionCategory } from "../validators/subscription-category.validator";

const router = Router();

router.get("/", getSubscriptionCategoriesController);
router.post(
  "/create",
  validateCreateSubscriptionCategory,
  createSubscriptionCategoryController
);

export default router;
