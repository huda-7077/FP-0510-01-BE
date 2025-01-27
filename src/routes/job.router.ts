import { Router } from "express";
import {
  getJobCategoriesController,
  getJobsController,
} from "../controllers/job.controller";

const router = Router();

router.get("/", getJobsController);
router.get("/categories", getJobCategoriesController);

export default router;
