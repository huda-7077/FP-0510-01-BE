import { Router } from "express";
import {
  createJobController,
  getJobCategoriesController,
  getJobController,
  getJobsController,
} from "../controllers/job.controller";
import { verifyToken } from "../lib/jwt";
import { verifyRole } from "../middleware/role.middleware";
import { validateCreateJob } from "../validators/job.validator";
import { uploader } from "../lib/multer";
import { imageFilter } from "../lib/fileFilter";

const router = Router();

router.get("/", getJobsController);
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

export default router;
