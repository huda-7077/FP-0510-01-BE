import { Router } from "express";
import { createSubscriptionController } from "../controllers/subscription.controller";
import { validateCreateSubscription } from "../validators/subscription.validator";

const router = Router();

router.post(
  "/create",
  validateCreateSubscription,
  createSubscriptionController
);

export default router;
