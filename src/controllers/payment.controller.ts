import { NextFunction, Request, Response } from "express";
import { getPaymentService } from "../services/payment/get-payment.service";
import { createPaymentService } from "../services/payment/create-payment.service";
import { getPaymentsService } from "../services/payment/get-payments.service";
import { updatePaymentService } from "../services/payment/update-payment.service";

export const getPaymentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const uuid = req.params.uuid;
    const result = await getPaymentService(uuid);
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
    const id = 1; // later change into Number(res.locals.user.id)
    const result = await getPaymentsService(id);
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
    const userId = 1; // later change into Number(res.locals.user.id)
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
      1, // later change into Number(res.locals.user.id)
      req.body,
      files.paymentProof?.[0]
    );
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
