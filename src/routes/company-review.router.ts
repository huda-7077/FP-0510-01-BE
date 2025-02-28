import { Router } from "express";
import {
  createCompanyReviewController,
  deleteCompanyReviewController,
  getCompanyReviewsController,
} from "../controllers/company-review.controller";
import { validateCreateCompanyReview } from "../validators/company-review.validator";
import { verifyToken } from "../lib/jwt";
import { verifyRole } from "../middleware/role.middleware";

const router = Router();

router.get("/:companyId", getCompanyReviewsController);
router.post(
  "/:companyId",
  verifyToken,
  verifyRole(["USER"]),
  validateCreateCompanyReview,
  createCompanyReviewController
);
router.delete(
  "/:id",
  verifyToken,
  verifyRole(["USER"]),
  deleteCompanyReviewController
);

export default router;
