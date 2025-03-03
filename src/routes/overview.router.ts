import { Router } from "express";
import {
  getDeveloperOverviewController,
  getOverviewController,
} from "../controllers/overview.controller";
import { verifyToken } from "../lib/jwt";
import { verifyRole } from "../middleware/role.middleware";

const router = Router();

router.get("/", getOverviewController);
router.get(
  "/developer",
  verifyToken,
  verifyRole(["DEVELOPER"]),
  getDeveloperOverviewController
);

export default router;
