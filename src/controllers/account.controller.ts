import { NextFunction, Request, Response } from "express";
import { changeEmailService } from "../services/account/change-email.service";
import { changePasswordService } from "../services/account/change-password.service";
import { deleteAccountService } from "../services/account/delete-account.service";
import { getProfileService } from "../services/account/get-profile.service";
import { updateProfileService } from "../services/account/update-profile.service";

export const getProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(res.locals.user.id);
    const result = await getProfileService(userId);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const updateProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(res.locals.user.id);
    const files = req.files as {
      profilePicture?: Express.Multer.File[];
      cvUrl?: Express.Multer.File[];
    };
    const result = await updateProfileService(userId, req.body, files);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const changeEmailController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(res.locals.user.id);
    const result = await changeEmailService(req.body, userId);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const changePasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(res.locals.user.id);
    const result = await changePasswordService(userId, req.body);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const deleteAccountController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(res.locals.user.id);
    const password = req.body.password;
    const result = await deleteAccountService(userId, password);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
