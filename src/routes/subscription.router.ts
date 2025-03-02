import { Router } from "express";
import {
  createSubscriptionController,
  deleteSubscriptionController,
  getSubscriptionController,
  getSubscriptionsController,
} from "../controllers/subscription.controller";
import { verifyToken } from "../lib/jwt";
import { verifyRole } from "../middleware/role.middleware";
import { validateCreateSubscription } from "../validators/subscription.validator";

const router = Router();
router.get(
  "/",
  verifyToken,
  verifyRole(["DEVELOPER"]),
  getSubscriptionsController
);
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
router.delete(
  "/:id",
  verifyToken,
  verifyRole(["USER"]),
  deleteSubscriptionController
);

export default router;
