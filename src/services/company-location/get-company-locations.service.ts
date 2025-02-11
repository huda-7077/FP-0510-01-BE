import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { PaginationQueryParams } from "../../types/pagination";

interface GetCompanyLocationQuery extends PaginationQueryParams {
  search?: string;
  companyId: number;
}

export const getCompanyLocationsService = async (
  query: GetCompanyLocationQuery
) => {
  try {
    const {
      search,
      companyId,
      page = 1,
      sortBy = "id",
      sortOrder = "asc",
      take,
    } = query;

    const whereClause: Prisma.CompanyLocationWhereInput = {};

    if (search) {
      whereClause.OR = [{ address: { contains: search, mode: "insensitive" } }];
    }

    if (companyId) {
      const parsedcompanyId = companyId && Number(companyId);
      whereClause.companyId = parsedcompanyId;
    } else {
      throw new Error("Company ID is required");
    }

    const companyLocations = await prisma.companyLocation.findMany({
      where: whereClause,
      ...(take !== -1
        ? {
            skip: (page - 1) * (take || 10),
            take: take || 10,
          }
        : {}),
      skip: (page - 1) * take,
      take: take,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        regency: { select: { regency: true, province: true } },
        company: { select: { name: true } },
      },
    });

    const count = await prisma.companyLocation.count({
      where: whereClause,
    });

    return {
      data: companyLocations,
      meta: {
        page: take !== -1 ? page : 1,
        take: take !== -1 ? take : count,
        total: count,
      },
    };
  } catch (error) {
    throw error;
  }
};
