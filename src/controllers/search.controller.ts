import { NextFunction, Request, Response } from "express";
import { searchService } from "../services/search/search.service";

export const getSearchSuggestionsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      res.status(400).json({ message: "Invalid query parameter" });
      return;
    }

    const suggestions = await searchService.getSearchSuggestions(q);

    res.status(200).send(suggestions);
  } catch (error) {
    next(error);
  }
};
