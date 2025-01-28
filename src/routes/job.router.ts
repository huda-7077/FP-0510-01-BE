import { Router } from "express";
import {
  getJobCategoriesController,
  getJobController,
  getJobsController,
} from "../controllers/job.controller";

const router = Router();

router.get("/", getJobsController);
router.get("/categories", getJobCategoriesController);
router.get("/:id", getJobController);

export default router;
