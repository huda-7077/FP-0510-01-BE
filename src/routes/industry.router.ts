import { Router } from "express";
import { getIndustriesController } from "../controllers/industry.controller";

const router = Router();

router.get("/", getIndustriesController);

export default router;
