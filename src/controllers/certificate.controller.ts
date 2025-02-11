import { NextFunction, Request, Response } from "express";
import { getCertificateService } from "../services/certificate/get-certificate.service";

export const getCertificateController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getCertificateService(
      req.params.slug,
      req.params.uuid
    );
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
