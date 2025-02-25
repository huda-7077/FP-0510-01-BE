import { Request, Response, NextFunction } from "express";
import { getBadgesService } from "../services/badge/get-badges.service";

export const getBadgesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      take: parseInt(req.query.take as string) || 3,
      page: parseInt(req.query.page as string) || 1,
    };
    const userId = parseInt(res.locals.user.id);
    const result = await getBadgesService(userId, query);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
