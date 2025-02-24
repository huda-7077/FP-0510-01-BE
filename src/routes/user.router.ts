import { Router } from "express";
import {
  getUserEducationLevelsController,
  getUsersAgeRangesController,
  getUsersCountByProvinceController,
  getUsersGenderCountController,
} from "../controllers/user.controller";

const router = Router();

router.get("/education-levels", getUserEducationLevelsController);
router.get("/count/age-ranges", getUsersAgeRangesController);
router.get("/count/gender", getUsersGenderCountController);
router.get("/count/province", getUsersCountByProvinceController);

export default router;
