import { Router } from "express";
import {
  createInterviewController,
  getInterviewController,
  getInterviewsController,
  updateInterviewController,
} from "../controllers/interview.controller";
import { verifyToken } from "../lib/jwt";
import { verifyRole } from "../middleware/role.middleware";
import {
  validateCreateInterview,
  validateUpdateInterview,
} from "../validators/interview.validator";

const router = Router();

router.get(
  "/",
  verifyToken,
  verifyRole(["ADMIN", "USER"]),
  getInterviewsController
);
router.get(
  "/:id",
  verifyToken,
  verifyRole(["ADMIN", "USER"]),
  getInterviewController
);
router.post(
  "/",
  verifyToken,
  verifyRole(["ADMIN"]),
  validateCreateInterview,
  createInterviewController
);
router.patch(
  "/:id",
  verifyToken,
  verifyRole(["ADMIN"]),
  validateUpdateInterview,
  updateInterviewController
);

export default router;
