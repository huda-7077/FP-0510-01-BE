import { NextFunction, Request, Response } from "express";
import { getCompanyReviewsService } from "../services/company-review/get-company-reviews.service";
import { createCompanyReviewService } from "../services/company-review/create-company-review.service";
import { deleteCompanyReviewService } from "../services/company-review/delete-company-review.service";

export const getCompanyReviewsController = async (
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
    };
    const companyId = Number(req.params.companyId);
    const result = await getCompanyReviewsService(query, companyId);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const createCompanyReviewController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(res.locals.user.id);
    const companyId = Number(req.params.companyId);
    const result = await createCompanyReviewService(
      req.body,
      userId,
      companyId
    );
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const deleteCompanyReviewController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(res.locals.user.id);
    const reviewId = Number(req.params.id);
    const result = await deleteCompanyReviewService(userId, reviewId);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
