import { Router } from "express";
import { getUserEducationLevelsController } from "../controllers/user.controller";

const router = Router();

router.get("/education-levels", getUserEducationLevelsController);

export default router;
