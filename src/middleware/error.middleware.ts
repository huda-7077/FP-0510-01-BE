import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError";
import { Prisma } from "@prisma/client";

export function errorMiddleware(
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        res.status(409).send({
          message: "Unique constraint violation. A duplicate value exists.",
          field: err.meta?.target,
        });
        break;
      case "P2003":
        res.status(400).send({
          message: "Foreign key constraint violation.",
          field: err.meta?.field_name,
        });
        break;
      case "P2025":
        res.status(404).send({
          message: "Record not found",
          model: err.meta?.modelName,
        });
        break;
      default:
        res.status(500).send({
          message: "An unexpected Prisma error occurred.",
          code: err.code,
        });
        break;
    }
    return;
  }

  const status = err.status || 400;
  const message = err.message || "Something went wrong";
  res.status(status).send({ message });
}
