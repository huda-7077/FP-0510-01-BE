import { NextFunction, Request, Response } from "express";
import { xenditUpdaterServices } from "../services/xendit-webhook/xendit-updater.service";

export const xenditWebhookController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await xenditUpdaterServices(req.body);

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
