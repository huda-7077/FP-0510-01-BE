import { Router } from "express";
import { getCompanyLocationController } from "../controllers/company-location.controller";

const router = Router();

router.get("/:id", getCompanyLocationController);

export default router;
