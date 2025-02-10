import { NextFunction, Request, Response } from "express";
import { fromBuffer } from "file-type";

export const imageFilter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as { [fieldName: string]: Express.Multer.File[] };
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/avif",
      "image/jpg",
      "image/webp",
      "image/heif",
      "image/heic",
    ];

    for (const fieldName in files) {
      const fileArray = files[fieldName];
      for (const file of fileArray) {
        const type = await fromBuffer(file.buffer);
        if (!type || !allowedTypes.includes(type?.mime)) {
          throw new Error(`File type ${type?.mime} is not allowed`);
        }
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const pdfFilter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as { [fieldName: string]: Express.Multer.File[] };
    const allowedTypes = ["application/pdf"];

    for (const fieldName in files) {
      const fileArray = files[fieldName];
      for (const file of fileArray) {
        const type = await fromBuffer(file.buffer);
        if (!type || !allowedTypes.includes(type?.mime)) {
          throw new Error(`File type ${type?.mime} is not allowed`);
        }
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const fileFilter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as { [fieldName: string]: Express.Multer.File[] };
    const allowedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/avif",
      "image/jpg",
      "image/webp",
      "image/heif",
      "image/heic",
    ];
    const allowedPdfType = ["application/pdf"];

    for (const fieldName in files) {
      const fileArray = files[fieldName];
      for (const file of fileArray) {
        if (fieldName === "cvUrl") {
          if (!allowedPdfType.includes(file.mimetype)) {
            throw new Error(`CV must be a PDF file`);
          }
          continue;
        }

        if (fieldName === "profilePicture") {
          const type = await fromBuffer(file.buffer);
          if (!type || !allowedImageTypes.includes(type.mime)) {
            throw new Error(`Profile picture must be an image file`);
          }
        }
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};
