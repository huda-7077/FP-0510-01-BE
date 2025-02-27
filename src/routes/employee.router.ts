import { Router } from "express";
import { verifyToken } from "../lib/jwt";
import { verifyRole } from "../middleware/role.middleware";
import {
  checkEmployeeExistanceController,
  getEmployeesController,
  registerEmployeeController,
  updateEmployeeController,
} from "../controllers/employee.controller";
import {
  validateRegisterEmployee,
  validateUpdateEmployee,
} from "../validators/employee.validator";

const router = Router();

router.post(
  "/",
  verifyToken,
  verifyRole(["ADMIN"]),
  validateRegisterEmployee,
  registerEmployeeController
);
router.get("/", verifyToken, verifyRole(["ADMIN"]), getEmployeesController);
router.get("/check-employee", verifyToken, checkEmployeeExistanceController);
router.patch(
  "/:id",
  verifyToken,
  verifyRole(["ADMIN"]),
  validateUpdateEmployee,
  updateEmployeeController
);

export default router;
