import { NextFunction, Request, Response } from "express";
import { getProvincesService } from "../services/location/get-provinces.service";
import { getRegenciesService } from "../services/location/get-regencies.service";

export const getProvincesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const regencyId = Number(req.query.regencyId as string) || undefined;
    const search = (req.query.search as string) || "";
    const provinces = await getProvincesService(regencyId, search);

    res.status(200).send(provinces);
  } catch (error) {
    next(error);
  }
};

export const getRegenciesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const provinceId = Number(req.query.provinceId as string) || undefined;
    const search = (req.query.search as string) || "";
    const regencies = await getRegenciesService(provinceId, search);

    res.status(200).send(regencies);
  } catch (error) {
    next(error);
  }
};
