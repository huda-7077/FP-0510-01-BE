import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { PaginationQueryParams } from "../../types/pagination";

interface GetJobApplicationsQuery extends PaginationQueryParams {
  search?: string;
  status?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
}

export const getUserJobApplicationsService = async (
  userId: number,
  query: GetJobApplicationsQuery
) => {
  try {
    const {
      page = 1,
      sortBy = "createdAt",
      sortOrder = "desc",
      take = 10,
      search,
      status,
      category,
      startDate,
      endDate,
    } = query;

    const whereClause: Prisma.JobApplicationWhereInput = {
      userId,
    };

    // If status filter is provided
    if (status) {
      whereClause.status = status as Prisma.EnumApplicationStatusFilter;
    }

    // Search functionality across job title, company name, or category
    if (search) {
      whereClause.OR = [
        { job: { title: { contains: search, mode: "insensitive" } } },
        {
          job: { company: { name: { contains: search, mode: "insensitive" } } },
        },
        { job: { category: { contains: search, mode: "insensitive" } } },
        {
          job: {
            companyLocation: {
              address: { contains: search, mode: "insensitive" },
            },
          },
        },
        { job: { tags: { has: search.toLowerCase() } } },
      ];
    }

    // Category filter
    if (category) {
      whereClause.job = {
        ...((whereClause.job as Prisma.JobWhereInput) || {}),
        category: { equals: category, mode: "insensitive" },
      };
    }

    // Date range filter
    if (startDate && endDate) {
      whereClause.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // Count total records for pagination
    const totalApplications = await prisma.jobApplication.count({
      where: whereClause,
    });

    // Get job applications with pagination and sorting
    const jobApplications = await prisma.jobApplication.findMany({
      where: whereClause,
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * take,
      take: take !== -1 ? take : undefined,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
            salary: true,
            tags: true,
            applicationDeadline: true,
            requiresAssessment: true,
            company: {
              select: {
                id: true,
                name: true,
                logo: true,
                industry: true,
              },
            },
            companyLocation: {
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
          },
        },
        interviews: {
          select: {
            id: true,
            scheduledDate: true,
            interviewerName: true,
            location: true,
            meetingLink: true,
          },
          where: {
            isDeleted: false,
          },
        },
      },
    });

    return {
      data: jobApplications,
      meta: {
        page: take !== -1 ? page : 1,
        take: take !== -1 ? take : totalApplications,
        total: totalApplications,
        searchQuery: search || null,
      },
    };
  } catch (error) {
    throw error;
  }
};
