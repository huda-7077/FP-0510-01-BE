import { Router } from "express";
import {
  createPaymentController,
  getPaymentController,
  getPaymentsController,
  updatePaymentController,
} from "../controllers/payment.controller";
import { verifyRoleUser } from "../middleware/role.middleware";
import { uploader } from "../lib/multer";
import { imageFilter } from "../lib/fileFilter";
import { validateCreatePayment } from "../validators/payment.validator";

const router = Router();

router.get("/invoice", getPaymentsController);
router.get("/invoice/:uuid", getPaymentController);
router.post("/create", validateCreatePayment, createPaymentController);
router.patch(
  "/update",
  uploader(2).fields([{ name: "paymentProof", maxCount: 1 }]),
  imageFilter,
  updatePaymentController
);

export default router;
