import { Router } from "express";
import {
  getCompanyLocationController,
  getCompanyLocationsController,
} from "../controllers/company-location.controller";

const router = Router();

router.get("/", getCompanyLocationsController);
router.get("/:id", getCompanyLocationController);

export default router;
