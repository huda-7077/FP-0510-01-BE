import { Router } from "express";
import {
  createInterviewController,
  getInterviewsController,
} from "../controllers/interview.controller";
import { verifyToken } from "../lib/jwt";
import { verifyRole } from "../middleware/role.middleware";

const router = Router();

router.get("/", verifyToken, getInterviewsController);
router.post("/", verifyToken, verifyRole(["ADMIN"]), createInterviewController);

export default router;
