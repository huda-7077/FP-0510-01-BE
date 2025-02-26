import { Router } from "express";
import { verifyToken } from "../lib/jwt";
import { verifyRole } from "../middleware/role.middleware";
import { getBadgesController } from "../controllers/badge.controller";

const router = Router();

router.get("/", verifyToken, verifyRole(["USER"]), getBadgesController);

export default router;
