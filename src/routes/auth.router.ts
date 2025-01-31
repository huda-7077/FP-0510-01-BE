import { Router } from "express";
import {
  googleLoginController,
  loginController,
  registerController,
  resendVerificationController,
  verifyEmailController,
} from "../controllers/auth.controller";
import {
  validateGoogleLogin,
  validateLogin,
  validateRegister,
  validateRequestVerification,
} from "../validators/auth.validator";
import { verifyTokenEmail } from "../lib/jwt";

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

export default router;
