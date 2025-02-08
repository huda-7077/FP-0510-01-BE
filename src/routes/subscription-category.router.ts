import { Router } from "express";
import {
  createSubscriptionCategoryController,
  getSubscriptionCategoriesController,
  updateSubscriptionCategoryController,
} from "../controllers/subscription-category.controller";
import {
  validateCreateSubscriptionCategory,
  validateUpdateSubscriptionCategory,
} from "../validators/subscription-category.validator";
import { verifyToken } from "../lib/jwt";
import { verifyRole } from "../middleware/role.middleware";

const router = Router();

router.get("/", getSubscriptionCategoriesController);
router.post(
  "/",
  verifyToken,
  verifyRole(["DEVELOPER"]),
  validateCreateSubscriptionCategory,
  createSubscriptionCategoryController
);
router.patch(
  "/:id",
  verifyToken,
  verifyRole(["DEVELOPER"]),
  validateUpdateSubscriptionCategory,
  updateSubscriptionCategoryController
);

export default router;
