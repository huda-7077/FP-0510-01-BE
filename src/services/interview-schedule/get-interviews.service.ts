import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { PaginationQueryParams } from "../../types/pagination";

interface GetInterviewsQuery extends PaginationQueryParams {
  search: string;
}

export const getInterviewsService = async (
  query: GetInterviewsQuery,
  userId: number
) => {
  try {
    const {
      page = 1,
      sortBy = "scheduledDate",
      sortOrder = "desc",
      take,
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

    const whereClause: Prisma.InterviewWhereInput = { isDeleted: false };

    if (
      user &&
      user.companyId &&
      whereClause.jobApplication &&
      whereClause.jobApplication.user
    ) {
      whereClause.jobApplication.user.companyId = user.companyId;
    }

    if (search) {
      whereClause.OR = [
        {
          jobApplication: {
            user: { fullName: { contains: search, mode: "insensitive" } },
          },
        },
        {
          jobApplication: {
            job: { title: { contains: search, mode: "insensitive" } },
          },
        },
      ];
    }

    const interview = await prisma.interview.findMany({
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
        jobApplication: {
          include: {
            user: {
              select: {
                fullName: true,
                email: true,
                phoneNumber: true,
                profilePicture: true,
                currentAddress: true,
                dateOfBirth: true,
                regency: {
                  select: {
                    regency: true,
                  },
                },
                educationLevel: true,
                experience: true,
              },
            },
            job: true,
          },
        },
      },
    });

    const count = await prisma.interview.count({
      where: whereClause,
    });

    return {
      data: interview,
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
