import * as streamifier from "streamifier";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from "../config";

cloudinary.config({
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  cloud_name: CLOUDINARY_CLOUD_NAME,
});

interface CloudinaryUploadOptions {
  folder?: string;
  resource_type?: "auto" | "image" | "video" | "raw";
}

export const cloudinaryUpload = (
  file: Express.Multer.File,
  options: CloudinaryUploadOptions = {}
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: options.folder,
      resource_type: options.resource_type || (file.mimetype === 'application/pdf' ? 'raw' : 'auto'),
      filename_override: file.originalname,
    };

    cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result: UploadApiResponse | undefined) => {
        if (error) return reject(error);
        if (result) {
          resolve(result);
        } else {
          reject(new Error("Upload result is undefined"));
        }
      }
    ).end(file.buffer);
  });
};

const extractPublicIdFromUrl = (url: string): string => {
  const urlParts = url.split("/");
  const publicIdWithExtension = urlParts[urlParts.length - 1];
  const publicId = publicIdWithExtension.split(".")[0];
  return publicId;
};

export const cloudinaryRemove = async (secure_url: string): Promise<any> => {
  try {
    const publicId = extractPublicIdFromUrl(secure_url);
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw error;
  }
};
