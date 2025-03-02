import { NextFunction, Request, Response } from "express";
import { checkEmployeeExistanceService } from "../services/employee/check-employee-existance.service";
import { getCompanyEmployeeService } from "../services/employee/get-company-employee.service";
import { getEmployeesService } from "../services/employee/get-employees.service";
import { registerEmployeeService } from "../services/employee/register-employee.service";
import { updateEmployeeService } from "../services/employee/update-employee.service";

export const registerEmployeeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyId = res.locals.user.companyId;
    const result = await registerEmployeeService(req.body, companyId);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const checkEmployeeExistanceController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = parseInt(req.query.userId as string);
    const companyId = res.locals.user.companyId;

    const result = await checkEmployeeExistanceService(companyId, userId);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getCompanyEmployeeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.id;
    const companyId = Number(req.params.companyId);

    const result = await getCompanyEmployeeService(companyId, userId);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getEmployeesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      take: parseInt(req.query.take as string) || 3,
      page: parseInt(req.query.page as string) || 1,
      sortBy: (req.query.sortBy as string) || "id",
      sortOrder: (req.query.sortOrder as string) || "desc",
      search: (req.query.search as string) || "",
      isDeleted: (req.query.isDeleted as string) || "",
      startDate: (req.query.startDate as string) || undefined,
      endDate: (req.query.endDate as string) || undefined,
    };

    const userId = res.locals.user.id;

    const result = await getEmployeesService(query, userId);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const updateEmployeeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyId = res.locals.user.companyId;
    const employeeId = parseInt(req.params.id);
    const result = await updateEmployeeService(req.body, companyId, employeeId);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
