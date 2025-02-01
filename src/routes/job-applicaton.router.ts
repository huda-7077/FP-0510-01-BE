import { Router } from "express";
import {
  getJobApplicationsController,
  getJobApplicationTotalController,
} from "../controllers/job-application.controller";

const router = Router();

router.get("/", getJobApplicationsController);
router.get("/total", getJobApplicationTotalController);

export default router;
