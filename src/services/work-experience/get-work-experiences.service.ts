import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { PaginationQueryParams } from "../../types/pagination";
import { ApiError } from "../../utils/apiError";

interface GetWorkExperiencesQuery extends PaginationQueryParams {
  search?: string;
}

export const getWorkExperiencesService = async (
  query: GetWorkExperiencesQuery,
  userId: number
) => {
  try {
    const {
      page = 1,
      sortBy = "endDate",
      sortOrder = "desc",
      take = 10,
      search,
    } = query;

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        isDeleted: false,
      },
    });

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const whereClause: Prisma.WorkExperienceWhereInput = {
      userId,
    };

    if (search) {
      whereClause.OR = [
        { companyName: { contains: search, mode: "insensitive" } },
        { jobTitle: { contains: search, mode: "insensitive" } },
      ];
    }

    const workExperiences = await prisma.workExperience.findMany({
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
    });

    const count = await prisma.workExperience.count({
      where: whereClause,
    });

    return {
      data: workExperiences,
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
