import { Prisma, SkillAssessmentStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { PaginationQueryParams } from "../../types/pagination";

interface GetSkillAssessmentsPublicQuery extends PaginationQueryParams {
  search: string;
}

export const getSkillAssessmentsPublicService = async (
  query: GetSkillAssessmentsPublicQuery
) => {
  try {
    const { page, sortBy, sortOrder, take, search } = query;

    const whereClause: Prisma.SkillAssessmentWhereInput = {};
    whereClause.status = SkillAssessmentStatus.PUBLISHED;

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const skillAssessments = await prisma.skillAssessment.findMany({
      where: whereClause,
      orderBy: {
        [sortBy]: sortOrder,
      },
      take,
      skip: (page - 1) * take,
    });

    const count = await prisma.skillAssessment.count({
      where: whereClause,
    });

    return {
      data: skillAssessments,
      meta: { page, take, total: count },
    };
  } catch (error) {
    throw error;
  }
};
