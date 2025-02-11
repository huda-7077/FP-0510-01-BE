import { NextFunction, Request, Response } from "express";
import { createSkillAssessmentServices } from "../services/skill-assessment/create-skill-assessment.service";

export const createSkillAssessmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as { [fieldName: string]: Express.Multer.File[] };

    const result = await createSkillAssessmentServices(
      req.body,
      files.badgeImage?.[0]
    );
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
