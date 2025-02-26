import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { PaginationQueryParams } from "../../types/pagination";

interface GetJobsQuery extends PaginationQueryParams {
  search?: string;
  category?: string;
  timeRange?: "week" | "month" | "custom";
  startDate?: string;
  endDate?: string;
  location?: string;
  companyId?: number;
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

export const getJobsService = async (query: GetJobsQuery) => {
  try {
    const {
      page = 1,
      sortBy = "createdAt",
      sortOrder = "desc",
      take = 10,
      search,
      category,
      timeRange,
      startDate,
      endDate,
      location,
      companyId,
      userLatitude,
      userLongitude,
      maxDistance = 50,
    } = query;

    const whereClause: Prisma.JobWhereInput = {
      isDeleted: false,
      isPublished: true,
      applicationDeadline: {
        gte: new Date(),
      },
    };

    if (companyId) {
      whereClause.companyId = companyId;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { company: { name: { contains: search, mode: "insensitive" } } },
        { tags: { has: search.toLocaleLowerCase() } },
      ];
    }

    if (category) {
      whereClause.category = category;
    }

    if (timeRange || (startDate && endDate)) {
      const now = new Date();
      let startDateTime: Date;
      let endDateTime = now;
      if (timeRange === "week") {
        startDateTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (timeRange === "month") {
        startDateTime = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        );
      } else if (startDate && endDate) {
        startDateTime = new Date(startDate);
        endDateTime = new Date(endDate);
      } else {
        startDateTime = now;
      }
      whereClause.createdAt = {
        gte: startDateTime,
        lte: endDateTime,
      };
    }

    if (location) {
      whereClause.companyLocation = {
        OR: [
          { address: { contains: location, mode: "insensitive" } },
          {
            regency: {
              regency: { contains: location, mode: "insensitive" },
            },
          },
        ],
      };
    }

    const jobs = await prisma.job.findMany({
      where: whereClause,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            industry: true,
            description: true,
          },
        },
        companyLocation: {
          select: {
            address: true,
            postalCode: true,
            latitude: true,
            longitude: true,
            regency: {
              select: {
                id: true,
                regency: true,
                province: {
                  select: {
                    id: true,
                    province: true,
                  },
                },
              },
            },
          },
        },
        preTestAssessments: {
          select: {
            id: true,
            slug: true,
            passingScore: true,
          },
        },
      },
    });

    // Filter and sort jobs by distance if user location is provided
    let filteredJobs = jobs;
    if (userLatitude && userLongitude) {
      filteredJobs = jobs
        .map((job) => {
          const jobLatitude = parseFloat(job.companyLocation?.latitude || "0");
          const jobLongitude = parseFloat(
            job.companyLocation?.longitude || "0"
          );
          const distance = haversineDistance(
            userLatitude,
            userLongitude,
            jobLatitude,
            jobLongitude
          );
          return { ...job, distance };
        })
        .filter((job) => job.distance <= maxDistance)
        .sort((a, b) => a.distance - b.distance);
    }

    const paginatedJobs = filteredJobs.slice((page - 1) * take, page * take);

    return {
      data: paginatedJobs,
      meta: {
        page: take !== -1 ? page : 1,
        take: take !== -1 ? take : filteredJobs.length,
        total: filteredJobs.length,
        searchQuery: search || null,
      },
    };
  } catch (error) {
    throw error;
  }
};
