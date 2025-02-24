import { Router } from "express";
import { getSearchSuggestionsController } from "../controllers/search.controller";

const router = Router();

router.get("/", getSearchSuggestionsController);

export default router;
