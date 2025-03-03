import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { PaginationQueryParams } from "../../types/pagination";

type CompanySortBy = "name" | "establishedYear" | "distance";

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
  userLatitude?: number;
  userLongitude?: number;
  maxDistance?: number;
}

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

type CompanyWithDistance = Prisma.CompanyGetPayload<{
  include: {
    companyLocations: {
      select: {
        address: boolean;
        postalCode: boolean;
        latitude: boolean;
        longitude: boolean;
        regency: {
          select: {
            regency: boolean;
            province: {
              select: {
                province: boolean;
              };
            };
          };
        };
      };
    };
    _count: {
      select: {
        jobs: boolean;
      };
    };
  };
}> & { distance?: number };

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
      userLatitude,
      userLongitude,
      maxDistance = 50,
    } = query;

    const validatedSortOrder = validateSortOrder(sortOrder);

    if (!["name", "establishedYear", "distance"].includes(sortBy)) {
      throw new Error("Invalid sortBy field.");
    }

    if (sortBy === "distance" && (!userLatitude || !userLongitude)) {
      throw new Error("Cannot sort by distance without user coordinates.");
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
    } else if (sortBy !== "distance") {
      orderByClause.name = validatedSortOrder;
    }

    const companies = await prisma.company.findMany({
      where: whereClause,
      ...(take !== -1 && !userLatitude && !userLongitude
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
            latitude: true,
            longitude: true,
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

    let processedCompanies: CompanyWithDistance[] = companies;
    if (userLatitude && userLongitude) {
      processedCompanies = companies
        .map((company) => {
          const distances = company.companyLocations.map((location) => {
            const locationLat = parseFloat(location.latitude || "0");
            const locationLng = parseFloat(location.longitude || "0");
            return haversineDistance(
              userLatitude,
              userLongitude,
              locationLat,
              locationLng
            );
          });

          // Find minimum distance (closest location)
          const minDistance =
            distances.length > 0 ? Math.min(...distances) : Infinity;

          return {
            ...company,
            distance: minDistance,
          };
        })
        .filter(
          (company) =>
            company.distance !== undefined && company.distance <= maxDistance
        );

      if (sortBy === "distance") {
        processedCompanies.sort((a, b) => {
          const distanceA = a.distance || Infinity;
          const distanceB = b.distance || Infinity;
          return distanceA - distanceB;
        });
      }
    }

    let paginatedCompanies = processedCompanies;
    if (
      ((userLatitude && userLongitude) || sortBy === "distance") &&
      take !== -1
    ) {
      const startIndex = (page - 1) * take;
      paginatedCompanies = processedCompanies.slice(
        startIndex,
        startIndex + take
      );
    }

    const formattedCompanies = paginatedCompanies.map((company) => {
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
        take: take !== -1 ? take : processedCompanies.length,
        total:
          userLatitude && userLongitude ? processedCompanies.length : count,
      },
    };
  } catch (error) {
    throw error;
  }
};
