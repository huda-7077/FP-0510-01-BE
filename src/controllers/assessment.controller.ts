import { NextFunction, Request, Response } from "express";
import { createAssessmentService } from "../services/assessment/create-assessment.service";
import { getAssessmentService } from "../services/assessment/get-assessment.service";
import { updateAssessmentStatusService } from "../services/assessment/update-assessment-status.service";
import { updateAssessmentService } from "../services/assessment/update-assessment.service";

export const getAssessmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const slug = req.params.slug;
    const role = res.locals.user.role;
    const result = await getAssessmentService(slug, role);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const createAssessmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyId = res.locals.user.companyId;
    const result = await createAssessmentService(req.body, companyId);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const updateAssessmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const slug = req.params.slug;
    const companyId = res.locals.user.companyId;
    const result = await updateAssessmentService(
      { ...req.body, slug },
      companyId
    );
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const updatePreTestAssessmentStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params;
    const companyId = res.locals.user.companyId;

    const result = await updateAssessmentStatusService(
      {
        ...req.body,
        slug,
      },
      companyId
    );
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
