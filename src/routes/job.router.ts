import { Router } from "express";
import {
  createJobController,
  deleteJobController,
  getCompanyJobController,
  getCompanyJobsController,
  getJobCategoriesController,
  getJobController,
  getJobsController,
  getPopularJobCategoriesController,
  updateJobController,
  updateJobStatusController,
} from "../controllers/job.controller";
import { verifyToken } from "../lib/jwt";
import { verifyRole } from "../middleware/role.middleware";
import {
  validateCreateJob,
  validateUpdateJob,
} from "../validators/job.validator";
import { uploader } from "../lib/multer";
import { imageFilter } from "../lib/fileFilter";

const router = Router();

router.get("/", getJobsController);
router.get("/company", verifyToken, getCompanyJobsController);
router.get("/categories", getJobCategoriesController);
router.get("/:id", getJobController);
router.get("/company/:id", verifyToken, getCompanyJobController);
router.get("/categories/popular", getPopularJobCategoriesController);
router.post(
  "/",
  verifyToken,
  verifyRole(["ADMIN"]),
  uploader(1).fields([{ name: "bannerImage", maxCount: 1 }]),
  imageFilter,
  validateCreateJob,
  createJobController
);
router.patch(
  "/:id",
  verifyToken,
  verifyRole(["ADMIN"]),
  uploader(1).fields([{ name: "bannerImage", maxCount: 1 }]),
  imageFilter,
  validateUpdateJob,
  updateJobController
);
router.patch(
  "/status/:id",
  verifyToken,
  verifyRole(["ADMIN"]),
  updateJobStatusController
);

router.delete("/:id", verifyToken, verifyRole(["ADMIN"]), deleteJobController);

export default router;
