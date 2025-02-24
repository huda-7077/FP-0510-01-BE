import { NextFunction, Request, Response } from "express";
import { getSkillAssessmentService } from "../services/skill-assessment/get-skill-assessment.service";
import { SkillAssessmentStatus } from "@prisma/client";
import { getSkillAssessmentsService } from "../services/skill-assessment/get-skill-assessments.service";
import { updateSkillAssessmentService } from "../services/skill-assessment/update-skill-assessment.service";
import { createSkillAssessmentService } from "../services/skill-assessment/create-skill-assessment.service";
import { updateSkillAssessmentStatusService } from "../services/skill-assessment/update-skill-assessment-status.service";
import { getSkillAssessmentsPublicService } from "../services/skill-assessment/get-skill-assessments-public.service";

export const getSkillAssessmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const slug = req.params.slug;
    const role = res.locals.user.role;
    const result = await getSkillAssessmentService(slug, role);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getSkillAssessmentsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      take: parseInt(req.query.take as string) || 3,
      page: parseInt(req.query.page as string) || 1,
      sortBy: (req.query.sortBy as string) || "createdAt",
      sortOrder: (req.query.sortOrder as string) || "desc",
      search: (req.query.search as string) || "",
      status: Object.values(SkillAssessmentStatus).includes(
        req.query.status as SkillAssessmentStatus
      )
        ? (req.query.status as SkillAssessmentStatus)
        : undefined,
    };
    const result = await getSkillAssessmentsService(query);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getSkillAssessmentsPublicController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      take: parseInt(req.query.take as string) || 3,
      page: parseInt(req.query.page as string) || 1,
      sortBy: (req.query.sortBy as string) || "createdAt",
      sortOrder: (req.query.sortOrder as string) || "desc",
      search: (req.query.search as string) || "",
    };
    const result = await getSkillAssessmentsPublicService(query);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const createSkillAssessmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as { [fieldName: string]: Express.Multer.File[] };

    const result = await createSkillAssessmentService(
      req.body,
      files.badgeImage?.[0]
    );
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const updateSkillAssessmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params;
    const files = req.files as { [fieldName: string]: Express.Multer.File[] };

    const result = await updateSkillAssessmentService(
      { ...req.body, slug },
      files.badgeImage?.[0]
    );
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
export const updateSkillAssessmentStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params;

    const result = await updateSkillAssessmentStatusService({
      ...req.body,
      slug,
    });
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
