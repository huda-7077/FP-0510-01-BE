import { Router } from "express";
import {
  createSubscriptionController,
  getSubscriptionController,
  getSubscriptionsController,
} from "../controllers/subscription.controller";
import { verifyToken } from "../lib/jwt";
import { verifyRole } from "../middleware/role.middleware";
import { validateCreateSubscription } from "../validators/subscription.validator";

const router = Router();
router.get("/", getSubscriptionsController);
router.get(
  "/current",
  verifyToken,
  verifyRole(["USER"]),
  getSubscriptionController
);
router.post(
  "/",
  verifyToken,
  verifyRole(["DEVELOPER"]),
  validateCreateSubscription,
  createSubscriptionController
);

export default router;
