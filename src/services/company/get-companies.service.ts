import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { PaginationQueryParams } from "../../types/pagination";

interface GetCompaniesQuery extends PaginationQueryParams {
  search?: string;
  location?: string;
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
    } = query;

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

    const companies = await prisma.company.findMany({
      where: whereClause,
      ...(take !== -1
        ? {
            skip: (page - 1) * take,
            take: take,
          }
        : {}),
      orderBy: {
        [sortBy]: sortOrder,
      },
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
        jobs: {
          where: {
            isDeleted: false,
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
        companyReviews: {
          select: {
            overallRating: true,
          },
        },
      },
    });

    const count = await prisma.company.count({
      where: whereClause,
    });

    // Calculate average rating for each company
    const companiesWithAvgRating = companies.map((company) => {
      const totalRating = company.companyReviews.reduce(
        (sum, review) => sum + review.overallRating,
        0
      );
      const avgRating =
        company.companyReviews.length > 0
          ? totalRating / company.companyReviews.length
          : 0;

      return {
        ...company,
        averageRating: Number(avgRating.toFixed(1)),
        totalJobs: company.jobs.length,
        companyReviews: undefined, 
        jobs: undefined,
      };
    });

    return {
      data: companiesWithAvgRating,
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
