import { Router } from "express";
import {
  createWorkExperienceController,
  deleteWorkExperienceController,
  getWorkExperiencesController,
} from "../controllers/work-experience.controller";
import { verifyToken } from "../lib/jwt";
import { validateCreateWorkExperience } from "../validators/work-experience";
import { verifyRole } from "../middleware/role.middleware";

const router = Router();

router.post(
  "/",
  verifyToken,
  verifyRole(["USER"]),
  validateCreateWorkExperience,
  createWorkExperienceController
);
router.get("/", verifyToken, getWorkExperiencesController);
router.delete(
  "/:id",
  verifyToken,
  verifyRole(["USER"]),
  deleteWorkExperienceController
);
router.delete(
  "/bulk",
  verifyToken,
  verifyRole(["USER"]),
  deleteWorkExperienceController
);
export default router;
