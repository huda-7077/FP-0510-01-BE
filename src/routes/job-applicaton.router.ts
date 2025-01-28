import { Router } from "express";
import { getJobApplicationTotalController } from "../controllers/job-application.controller";

const router = Router();

router.get("/total", getJobApplicationTotalController);

export default router;
