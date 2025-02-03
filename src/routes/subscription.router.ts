import { Router } from "express";
import {
  createSubscriptionController,
  getSubscriptionController,
} from "../controllers/subscription.controller";
import { verifyToken } from "../lib/jwt";
import { verifyRole } from "../middleware/role.middleware";
import { validateCreateSubscription } from "../validators/subscription.validator";

const router = Router();
router.get(
  "/current",
  verifyToken,
  verifyRole("USER"),
  getSubscriptionController
);
router.post(
  "/create",
  validateCreateSubscription,
  createSubscriptionController
);

export default router;
