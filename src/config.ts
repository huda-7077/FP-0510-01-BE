import dotenv from "dotenv";

dotenv.config();
export const PORT = process.env.PORT;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_SECRET_VERIFY_EMAIL = process.env.JWT_SECRET_VERIFY_EMAIL;
export const JWT_SECRET_FORGOT_PASSWORD =
  process.env.JWT_SECRET_FORGOT_PASSWORD;
export const GMAIL_EMAIL = process.env.GMAIL_EMAIL;
export const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
export const BASE_URL_FE = process.env.BASE_URL_FE;
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
export const XENDIT_SECRET_API_KEY = process.env.XENDIT_SECRET_API_KEY!;
export const XENDIT_CALLBACK_TOKEN = process.env.XENDIT_CALLBACK_TOKEN!;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
