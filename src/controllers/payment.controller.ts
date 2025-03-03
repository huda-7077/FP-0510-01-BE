import { PaymentMethod, PaymentStatus } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { createPaymentService } from "../services/payment/create-payment.service";
import { getPaymentService } from "../services/payment/get-payment.service";
import { getPaymentsByUserService } from "../services/payment/get-payments-by-user.service";
import { getPaymentsService } from "../services/payment/get-payments.service";
import { updatePaymentService } from "../services/payment/update-payment.service";
import { getPaymentsUserService } from "../services/payment/get-payments-user-service";

export const getPaymentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(res.locals.user.id);
    const uuid = req.params.uuid;
    const result = await getPaymentService(id, uuid);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getPaymentsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      take: parseInt(req.query.take as string) || 3,
      page: parseInt(req.query.page as string) || 1,
      sortBy: (req.query.sortBy as string) || "createdAt",
      sortOrder: (req.query.sortOrder as string) || "desc",
      search: (req.query.search as string) || "",
      status: Object.values(PaymentStatus).includes(
        req.query.status as PaymentStatus
      )
        ? (req.query.status as PaymentStatus)
        : undefined,
      paymentMethod: Object.values(PaymentMethod).includes(
        req.query.paymentMethod as PaymentMethod
      )
        ? (req.query.paymentMethod as PaymentMethod)
        : undefined,
    };
    const userId = Number(res.locals.user.id);
    let result;
    if (res.locals.user.role === "DEVELOPER") {
      result = await getPaymentsService(query);
    } else {
      result = await getPaymentsUserService(query, userId);
    }
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getPaymentsByUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(res.locals.user.id);
    const result = await getPaymentsByUserService(id);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const createPaymentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(res.locals.user.id);
    const body = req.body;
    const result = await createPaymentService(userId, body);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const updatePaymentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as { [fieldName: string]: Express.Multer.File[] };

    const result = await updatePaymentService(
      Number(res.locals.user.id),
      req.body,
      files.paymentProof?.[0]
    );
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
