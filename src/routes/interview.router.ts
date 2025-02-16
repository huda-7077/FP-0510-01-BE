import { Router } from "express";
import {
  createInterviewController,
  deleteInterviewController,
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
router.delete(
  "/:id",
  verifyToken,
  verifyRole(["ADMIN"]),
  deleteInterviewController
);

export default router;
