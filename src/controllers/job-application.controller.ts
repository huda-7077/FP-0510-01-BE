import { NextFunction, Request, Response } from "express";
import { getJobApplicationsTotalService } from "../services/job-application/get-job-applications-total.service";

export const getJobApplicationTotalController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      jobId: parseInt(req.query.jobId as string) || 0,
    };

    const result = await getJobApplicationsTotalService(query);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
