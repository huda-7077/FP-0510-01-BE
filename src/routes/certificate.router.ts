import { Router } from "express";
import { getCertificateController } from "../controllers/certificate.controller";

const router = Router();

router.get("/:slug/:uuid", getCertificateController);

export default router;
