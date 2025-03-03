import { Router } from "express";
import {
  createJobApplicationController,
  getAvgSalaryByPositionController,
  getAvgSalaryByProvinceController,
  getJobApplicationController,
  getJobApplicationsController,
  checkJobApplicationsUserIdController,
  getJobApplicationTotalController,
  getUserJobApplicationsController,
  updateJobApplicationController,
} from "../controllers/job-application.controller";
import {
  validateCreateJobApplication,
  validateUpdateJobApplication,
} from "../validators/job-application.validator";
import { verifyToken } from "../lib/jwt";
import { verifyRole } from "../middleware/role.middleware";
import { uploader } from "../lib/multer";

const router = Router();

//! Don't forget to add the verifyToken later!

router.get(
  "/user",
  verifyToken,
  verifyRole(["USER"]),
  getUserJobApplicationsController
);
router.get(
  "/:id",
  verifyToken,
  verifyRole(["USER"]),
  getJobApplicationController
);
router.get("/", verifyToken, getJobApplicationsController);
router.get(
  "/check-applicant",
  verifyToken,
  checkJobApplicationsUserIdController
);
router.get("/total", getJobApplicationTotalController);
router.get("/avg-salary/position", getAvgSalaryByPositionController);
router.get("/avg-salary/province", getAvgSalaryByProvinceController);
router.post(
  "/",
  verifyToken,
  verifyRole(["USER"]),
  uploader(1).fields([
    { name: "cvFile", maxCount: 1 },
    { name: "attachment", maxCount: 1 },
  ]),
  validateCreateJobApplication,
  createJobApplicationController
);
router.patch(
  "/:id",
  verifyToken,
  verifyRole(["ADMIN", "USER"]),
  validateUpdateJobApplication,
  updateJobApplicationController
);

export default router;
