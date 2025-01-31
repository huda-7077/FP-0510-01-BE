import { NextFunction, Request, Response } from "express";
import { googleLoginService } from "../services/auth/google-login.service";
import { registerService } from "../services/auth/register.service";
import { verifyEmailService } from "../services/auth/verification.service";
import { resendVerificationToken } from "../services/auth/resend-verification.service";
import { loginService } from "../services/auth/login.service";

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

// controllers/auth.controller.ts
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
    const userId = Number(res.locals.user.userId);
    const result = await verifyEmailService(userId);
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
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
