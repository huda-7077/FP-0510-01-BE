import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { PaginationQueryParams } from "../../types/pagination";

type CompanySortBy = "name" | "establishedYear";

const validateSortOrder = (order: string): Prisma.SortOrder => {
  if (order === "asc" || order === "desc") {
    return order;
  }
  throw new Error("Invalid sortOrder. Must be 'asc' or 'desc'.");
};

interface GetCompaniesQuery extends PaginationQueryParams {
  search?: string;
  location?: string;
  industry?: string;
  establishedYearMin?: string;
  establishedYearMax?: string;
  hasActiveJobs?: string;
}

export const getCompaniesService = async (query: GetCompaniesQuery) => {
  try {
    const {
      page = 1,
      sortBy = "name",
      sortOrder = "asc",
      take = 10,
      search,
      location,
      industry,
      establishedYearMin,
      establishedYearMax,
      hasActiveJobs,
    } = query;

    const validatedSortOrder = validateSortOrder(sortOrder);

    if (!["name", "establishedYear"].includes(sortBy)) {
      throw new Error("Invalid sortBy field.");
    }

    const whereClause: Prisma.CompanyWhereInput = {
      isDeleted: false,
    };

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { industry: { contains: search, mode: "insensitive" } },
      ];
    }

    if (location) {
      whereClause.companyLocations = {
        some: {
          OR: [
            { address: { contains: location, mode: "insensitive" } },
            {
              regency: { regency: { contains: location, mode: "insensitive" } },
            },
          ],
        },
      };
    }

    if (industry) {
      whereClause.industry = { contains: industry, mode: "insensitive" };
    }

    if (establishedYearMin || establishedYearMax) {
      whereClause.establishedYear = {};
      if (establishedYearMin) {
        whereClause.establishedYear.gte = parseInt(establishedYearMin, 10);
      }
      if (establishedYearMax) {
        whereClause.establishedYear.lte = parseInt(establishedYearMax, 10);
      }
    }

    if (hasActiveJobs === "true") {
      whereClause.jobs = {
        some: {
          isDeleted: false,
          isPublished: true,
        },
      };
    }

    const orderByClause: Prisma.CompanyOrderByWithRelationInput = {};
    if (sortBy === "establishedYear") {
      orderByClause.establishedYear = validatedSortOrder;
    } else {
      orderByClause.name = validatedSortOrder; // Default to sorting by name
    }

    const companies = await prisma.company.findMany({
      where: whereClause,
      ...(take !== -1
        ? {
            skip: (page - 1) * take,
            take: take,
          }
        : {}),
      orderBy: orderByClause,
      include: {
        companyLocations: {
          select: {
            address: true,
            postalCode: true,
            regency: {
              select: {
                regency: true,
                province: {
                  select: {
                    province: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            jobs: {
              where: {
                isDeleted: false,
                isPublished: true,
              },
            },
          },
        },
      },
    });

    const count = await prisma.company.count({
      where: whereClause,
    });

    const companyIds = companies.map((company) => company.id);
    const avgRatings = await prisma.companyReview.groupBy({
      by: ["companyId"],
      _avg: {
        overallRating: true,
      },
      where: {
        companyId: {
          in: companyIds,
        },
      },
    });

    const formattedCompanies = companies.map((company) => {
      const avgRating = avgRatings.find((r) => r.companyId === company.id)?._avg
        .overallRating;
      return {
        ...company,
        averageRating: avgRating ? Number(avgRating.toFixed(1)) : 0,
        totalJobs: company._count.jobs,
      };
    });

    return {
      data: formattedCompanies,
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
