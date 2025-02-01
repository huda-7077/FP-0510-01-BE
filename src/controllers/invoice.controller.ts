import { NextFunction, Request, Response } from "express";
import { getInvoiceService } from "../services/invoice/get-invoice.service";

export const getInvoiceController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const uuid = req.params.uuid;
    const result = await getInvoiceService(uuid);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
