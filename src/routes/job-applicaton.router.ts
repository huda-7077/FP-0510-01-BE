import { Router } from "express";
import {
  getAvgSalaryByPositionController,
  getAvgSalaryByProvinceController,
  getJobApplicationsController,
  getJobApplicationTotalController,
  updateJobApplicationController,
} from "../controllers/job-application.controller";
import { validateUpdateJobApplication } from "../validators/job-application.validator";
import { verifyToken } from "../lib/jwt";
import { verifyRole } from "../middleware/role.middleware";

const router = Router();

//! Don't forget to add the verifyToken later!

router.get("/", verifyToken, getJobApplicationsController);
router.get("/total", getJobApplicationTotalController);
router.get("/avg-salary/position", getAvgSalaryByPositionController);
router.get("/avg-salary/province", getAvgSalaryByProvinceController);
router.patch(
  "/:id",
  verifyToken,
  verifyRole(["ADMIN"]),
  validateUpdateJobApplication,
  updateJobApplicationController
);

export default router;
