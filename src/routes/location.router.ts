import express from "express";
import {
  getProvincesController,
  getRegenciesController,
} from "../controllers/location.controller";

const router = express.Router();

router.get("/provinces", getProvincesController);
router.get("/regencies", getRegenciesController);

export default router;
