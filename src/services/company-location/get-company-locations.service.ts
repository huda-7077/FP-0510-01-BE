import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { PaginationQueryParams } from "../../types/pagination";

interface GetCompanyLocationsQuery extends PaginationQueryParams {
  search?: string;
  category?: string;
}

export const getCompanyLocationsService = async (
  query: GetCompanyLocationsQuery,
  userId: number
) => {
  try {
    const {
      page = 1,
      sortBy = "createdAt",
      sortOrder = "desc",
      take = 10,
      search,
    } = query;

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        isDeleted: false,
      },
      include: {
        company: {
          where: {
            isDeleted: false,
          },
        },
      },
    });

    if (!user || !user.company) {
      throw new Error("Company not found");
    }

    const whereClause: Prisma.CompanyLocationWhereInput = {
      companyId: user.company.id,
    };

    if (search) {
      whereClause.OR = [
        { address: { contains: search, mode: "insensitive" } },
        {
          regency: {
            regency: { contains: search, mode: "insensitive" },
          },
        },
        {
          regency: {
            province: {
              province: { contains: search, mode: "insensitive" },
            },
          },
        },
      ];
    }

    const companyLocations = await prisma.companyLocation.findMany({
      where: whereClause,
      ...(take !== -1
        ? {
            skip: (page - 1) * take,
            take,
          }
        : {}),
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        regency: {
          include: {
            province: true,
          },
        },
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
