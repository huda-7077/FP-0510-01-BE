import { Router } from "express";
import {
  changeEmailController,
  changePasswordController,
  deleteAccountController,
  getProfileController,
  updateProfileController,
} from "../controllers/account.controller";
import { fileFilter } from "../lib/fileFilter";
import { verifyToken } from "../lib/jwt";
import { uploader } from "../lib/multer";
import {
  validateChangeEmail,
  validateChangePassword,
  validateUpdateProfile,
} from "../validators/account.validator";

const router = Router();

router.get("/profile", verifyToken, getProfileController);
router.patch(
  "/profile",
  verifyToken,
  uploader(1).fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "cvUrl", maxCount: 1 },
  ]),
  fileFilter,
  validateUpdateProfile,
  updateProfileController
);
router.patch("/email", verifyToken, validateChangeEmail, changeEmailController);
router.patch(
  "/password",
  verifyToken,
  validateChangePassword,
  changePasswordController
);
router.delete("/profile", verifyToken, deleteAccountController);

export default router;
