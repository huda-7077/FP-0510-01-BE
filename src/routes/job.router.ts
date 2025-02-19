import { Router } from "express";
import {
  createJobController,
  deleteJobController,
  getJobCategoriesController,
  getJobController,
  getJobsController,
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

router.get("/", verifyToken, getJobsController);
router.get("/categories", getJobCategoriesController);
router.get("/:id", getJobController);
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
