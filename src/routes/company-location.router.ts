import { Router } from "express";
import {
  createCompanyLocationController,
  deleteCompanyLocationController,
  getCompanyLocationController,
  getCompanyLocationsController,
} from "../controllers/company-location.controller";
import { verifyToken } from "../lib/jwt";
import { verifyRole } from "../middleware/role.middleware";
import { validateCreateCompanyLocation } from "../validators/company-location.validator";

const router = Router();

router.get(
  "/",
  verifyToken,
  verifyRole(["ADMIN"]),
  getCompanyLocationsController
);
router.get("/:id", getCompanyLocationController);
router.post(
  "/",
  verifyToken,
  validateCreateCompanyLocation,
  verifyRole(["ADMIN"]),
  createCompanyLocationController
);
router.delete(
  "/:id",
  verifyToken,
  verifyRole(["ADMIN"]),
  deleteCompanyLocationController
);

export default router;
