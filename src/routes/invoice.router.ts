import { Router } from "express";
import { getInvoiceController } from "../controllers/invoice.controller";

const router = Router();

router.get("/:uuid", getInvoiceController);

export default router;
