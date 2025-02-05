import { Router } from "express";
import {
  forgotPasswordController,
  googleLoginController,
  loginController,
  registerController,
  resendVerificationController,
  resetPasswordController,
  verifyEmailController,
} from "../controllers/auth.controller";
import {
  validateGoogleLogin,
  validateLogin,
  validateRegister,
  validateRequestVerification,
  validateResetPassword,
  validateSendResetPassword,
} from "../validators/auth.validator";
import { verifyTokenEmail, verifyTokenReset } from "../lib/jwt";

const router = Router();

router.post("/register", validateRegister, registerController);
router.post("/login", validateLogin, loginController);
router.post("/google-login", validateGoogleLogin, googleLoginController);
router.get("/verify-email", verifyTokenEmail, verifyEmailController);
router.post(
  "/resend-verification",
  validateRequestVerification,
  resendVerificationController
);
router.post(
  "/forgot-password",
  validateSendResetPassword,
  forgotPasswordController
);
router.patch(
  "/reset-password",
  verifyTokenReset,
  validateResetPassword,
  resetPasswordController
);

export default router;
