import { NextFunction, Request, Response } from "express";
import { googleLoginService } from "../services/auth/google-login.service";
import { registerService } from "../services/auth/register.service";
import { verifyEmailService } from "../services/auth/verification.service";
import { resendVerificationToken } from "../services/auth/resend-verification.service";
import { loginService } from "../services/auth/login.service";
import { forgotPasswordService } from "../services/auth/forgot-password.service";
import { resetPasswordService } from "../services/auth/reset-password.service";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await registerService(req.body);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const result = await loginService(email, password);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const googleLoginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await googleLoginService(req.body.token);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const verifyEmailController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(res.locals.user.id);
    const tokenId = Number(res.locals.tokenId);
    const result = await verifyEmailService(userId, tokenId);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const resendVerificationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const result = await resendVerificationToken(email);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const forgotPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;
    const result = await forgotPasswordService(email);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const resetPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = Number(res.locals.user.id);
    const { password } = req.body;

    if (!password) {
      res.status(400).send({ message: "New password is required" });
      return;
    }

    const result = await resetPasswordService(userId, password);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
