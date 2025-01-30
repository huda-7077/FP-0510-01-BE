import { NextFunction, Request, Response } from "express";
import { TokenExpiredError, verify } from "jsonwebtoken";
import {
  JWT_SECRET,
  JWT_SECRET_FORGOT_PASSWORD,
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
    }
    res.locals.user = payload;

    next();
  });
};

export const verifyTokenReset = (
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

  verify(token, JWT_SECRET_FORGOT_PASSWORD!, (err, payload) => {
    if (err) {
      if (err instanceof TokenExpiredError) {
        res.status(401).send({ message: "Token expired" });
      } else {
        res.status(401).send({ message: "Invalid token" });
      }
    }
    res.locals.user = payload;

    next();
  });
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

    await prisma.verificationToken.update({
      where: { id: validToken.id },
      data: { isValid: false },
    });

    res.locals.user = decoded;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res
        .status(401)
        .send({
          message: "Verification link has expired. Please request a new one.",
        });
    } else {
      res.status(401).send({ message: "Invalid verification link" });
    }
  }
};
