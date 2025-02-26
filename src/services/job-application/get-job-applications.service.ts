import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { PaginationQueryParams } from "../../types/pagination";
import { ApiError } from "../../utils/apiError";

interface GetJobApplicationsQuery extends PaginationQueryParams {
  search: string;
  jobId: number;
  educationLevel: string;
}

export const getJobApplicationsService = async (
  query: GetJobApplicationsQuery,
  userId: number
) => {
  try {
    const {
      page = 1,
      sortBy = "createdAt",
      sortOrder = "asc",
      take,
      search,
      jobId,
      educationLevel,
    } = query;

    // Fetch the admin user and their associated company
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        isDeleted: false,
        role: "ADMIN",
      },
      include: {
        company: {
          where: {
            isDeleted: false,
          },
        },
      },
    });

    // Ensure the admin is associated with a company
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    if (!user.companyId) {
      throw new ApiError("Admin is not associated with any company", 403);
    }

    // Build the WHERE clause for filtering job applications
    const whereClause: Prisma.JobApplicationWhereInput = {
      job: {
        companyId: user.companyId,
      },
      OR: [
        // Users with an active "PROFESSIONAL" subscription
        {
          user: {
            subscriptions: {
              some: {
                status: "ACTIVE", // Subscription must be active
                expiredDate: {
                  gt: new Date(),
                },
                payment: {
                  category: {
                    name: "PROFESSIONAL",
                  },
                },
              },
            },
          },
        },
        {
          user: {
            subscriptions: {
              none: {},
            },
          },
        },
      ],
    };

    if (jobId) {
      whereClause.jobId = jobId;
    }

    if (educationLevel) {
      if (whereClause.user) {
        whereClause.user.educationLevel = educationLevel;
      } else {
        whereClause.user = { educationLevel };
      }
    }

    if (search) {
      whereClause.OR = [
        ...(whereClause.OR || []),
        { user: { fullName: { contains: search, mode: "insensitive" } } },
      ];
    }

    const orderByClause: Prisma.JobApplicationOrderByWithRelationInput[] = [
      {
        user: {
          subscriptions: {
            _count: "desc",
          },
        },
      },
      sortBy === "dateOfBirth"
        ? {
            user: {
              dateOfBirth: sortOrder as Prisma.SortOrder,
            },
          }
        : {
            [sortBy]: sortOrder as Prisma.SortOrder,
          },
    ];

    const jobApplications = await prisma.jobApplication.findMany({
      where: whereClause,
      ...(take !== -1
        ? {
            skip: (page - 1) * (take || 10),
            take: take || 10,
          }
        : {}),
      orderBy: orderByClause,
      include: {
        job: {
          select: {
            title: true,
            requiresAssessment: true,
            preTestAssessments: {
              include: {
                userPreTestAssessments: {
                  select: {
                    userId: true,
                    score: true,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            fullName: true,
            currentAddress: true,
            educationLevel: true,
            dateOfBirth: true,
            email: true,
            gender: true,
            phoneNumber: true,
            profilePicture: true,
            regency: {
              select: {
                regency: true,
              },
            },
            experience: true,
            subscriptions: {
              where: {
                status: "ACTIVE",
                expiredDate: {
                  gt: new Date(),
                },
                payment: {
                  category: {
                    name: "PROFESSIONAL",
                  },
                },
              },
              select: {
                id: true, // Select only the ID to check if the subscription exists
              },
            },
          },
        },
      },
    });

    const count = await prisma.jobApplication.count({
      where: whereClause,
    });

    return {
      data: jobApplications.map((application) => ({
        ...application,
        user: {
          ...application.user,
          hasProfessionalSubscription:
            application.user.subscriptions.length > 0, // Add a computed field
        },
      })),
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
