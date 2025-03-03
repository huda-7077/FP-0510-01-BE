import { Router } from "express";
import {
  createSavedJobController,
  deleteSavedJobController,
  getSavedJobsController,
} from "../controllers/saved-job.controller";
import { verifyToken } from "../lib/jwt";
import { verifyRole } from "../middleware/role.middleware";
import { validateCreateSavedJob } from "../validators/saved-job.validator";

const router = Router();

router.post(
  "/",
  verifyToken,
  validateCreateSavedJob,
  createSavedJobController
);
router.get("/", verifyToken, getSavedJobsController);
router.delete(
  "/:id",
  verifyToken,
  verifyRole(["USER"]),
  deleteSavedJobController
);

export default router;
