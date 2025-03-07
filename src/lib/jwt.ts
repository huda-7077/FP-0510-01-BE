import { NextFunction, Request, Response } from "express";
import { TokenExpiredError, verify } from "jsonwebtoken";
import {
  JWT_SECRET,
  JWT_SECRET_RESET_PASSWORD,
  JWT_SECRET_VERIFY_EMAIL,
} from "../config";
import { prisma } from "./prisma";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).send({
      message: "authorization failed, token is missing",
    });
    return;
  }

  verify(token, JWT_SECRET!, (err, payload) => {
    if (err) {
      if (err instanceof TokenExpiredError) {
        res.status(401).send({ message: "Token expired" });
      } else {
        res.status(401).send({ message: "Invalid token" });
      }
      return;
    }
    res.locals.user = payload;

    next();
  });
};

export const verifyTokenReset = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).send({ message: "Authorization failed, token is missing" });
    return;
  }

  try {
    const decoded = verify(token, JWT_SECRET_RESET_PASSWORD!) as {
      id: number;
    };

    const validToken = await prisma.resetPasswordToken.findFirst({
      where: {
        token,
        userId: decoded.id,
        isValid: true,
        expiresAt: { gt: new Date() },
      },
    });

    if (!validToken) {
      res.status(401).send({
        message:
          "This reset link is invalid or has expired. Please request a new one.",
      });
      return;
    }

    await prisma.resetPasswordToken.update({
      where: { id: validToken.id },
      data: { isValid: false },
    });

    res.locals.user = decoded;

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).send({
        message: "Reset link has expired. Please request a new one.",
      });
    } else {
      res.status(401).send({ message: "Invalid reset link" });
    }
  }
};

export const verifyTokenEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).send({
      message: "authorization failed, token is missing",
    });
    return;
  }

  try {
    const decoded = verify(token, JWT_SECRET_VERIFY_EMAIL!) as {
      userId: number;
    };

    const validToken = await prisma.verificationToken.findFirst({
      where: {
        token,
        userId: decoded.userId,
        isValid: true,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!validToken) {
      res.status(401).send({
        message:
          "This verification link is invalid or has expired. Please request a new verification email.",
      });
      return;
    }

    res.locals.user = decoded;
    res.locals.tokenId = validToken.id;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).send({
        message: "Verification link has expired. Please request a new one.",
      });
    } else {
      res.status(401).send({ message: "Invalid verification link" });
    }
  }
};
