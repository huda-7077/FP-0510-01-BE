import { Router } from "express";
import {
  createPaymentController,
  getPaymentController,
  getPaymentsByUserController,
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

router.get(
  "/",
  verifyToken,
  verifyRole(["DEVELOPER", "USER"]),
  getPaymentsController
);
router.get(
  "/invoice",
  verifyToken,
  verifyRole(["USER"]),
  getPaymentsByUserController
);
router.get(
  "/invoice/:uuid",
  verifyToken,
  verifyRole(["USER"]),
  getPaymentController
);
router.post(
  "/",
  verifyToken,
  verifyRole(["USER"]),
  verifySubscription,
  validateCreatePayment,
  createPaymentController
);
router.patch(
  "/",
  verifyToken,
  verifyRole(["USER"]),
  uploader(2).fields([{ name: "paymentProof", maxCount: 1 }]),
  imageFilter,
  updatePaymentController
);

export default router;
