import { NextFunction, Request, Response } from "express";
import { GetUsersEducationLevelByJobIdService } from "../services/user/get-user-education-levels-by-job-id.service";

export const getUserEducationLevelsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      jobId: parseInt(req.query.jobId as string) || 0,
    };

    const result = await GetUsersEducationLevelByJobIdService(query);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
