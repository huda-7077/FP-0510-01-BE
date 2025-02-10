import { Router } from "express";
import {
  getCompanyProfileController,
  updateCompanyProfileController,
} from "../controllers/company.controller";
import { fileFilter } from "../lib/fileFilter";
import { verifyToken } from "../lib/jwt";
import { uploader } from "../lib/multer";
import { validateUpdateCompanyProfile } from "../validators/company.validator";
import { verifyRole } from "../middleware/role.middleware";

const router = Router();

router.get(
  "/profile",
  verifyToken,
  verifyRole(["ADMIN"]),
  getCompanyProfileController
);
router.patch(
  "/profile",
  verifyToken,
  uploader(1).fields([{ name: "logo", maxCount: 1 }]),
  fileFilter,
  validateUpdateCompanyProfile,
  verifyRole(["ADMIN"]),
  updateCompanyProfileController
);

export default router;
