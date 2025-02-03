import { Router } from "express";
import {
  createPaymentController,
  getPaymentController,
  getPaymentsController,
  updatePaymentController,
} from "../controllers/payment.controller";
import { verifyRole } from "../middleware/role.middleware";
import { uploader } from "../lib/multer";
import { imageFilter } from "../lib/fileFilter";
import { validateCreatePayment } from "../validators/payment.validator";
import { verifyToken } from "../lib/jwt";
import { verifySubscription } from "../middleware/subscription.middleware";

const router = Router();

router.get("/invoice", verifyToken, verifyRole("USER"), getPaymentsController);
router.get(
  "/invoice/:uuid",
  verifyToken,
  verifyRole("USER"),
  getPaymentController
);
router.post(
  "/create",
  verifyToken,
  verifyRole("USER"),
  verifySubscription,
  validateCreatePayment,
  createPaymentController
);
router.patch(
  "/update",
  verifyToken,
  verifyRole("USER"),
  uploader(2).fields([{ name: "paymentProof", maxCount: 1 }]),
  imageFilter,
  updatePaymentController
);

export default router;
