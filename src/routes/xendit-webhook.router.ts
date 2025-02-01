import { Router } from "express";
import { xenditWebhookController } from "../controllers/xendit-webhook.controller";
import { xenditWebhookMiddleware } from "../middleware/xendit.middleware";

const router = Router();

router.post("/", xenditWebhookMiddleware, xenditWebhookController);

export default router;
