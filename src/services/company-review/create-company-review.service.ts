import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

interface CreateCompanyReviewBody {
  salaryEstimate: number;
  workCultureRating: number;
  workLifeBalanceRating: number;
  facilitiesRating: number;
  careerGrowthRating: number;
  comment: string;
}

export const createCompanyReviewService = async (
  body: CreateCompanyReviewBody,
  userId: number,
  companyId: number
) => {
  try {
    const {
      salaryEstimate,
      workCultureRating,
      workLifeBalanceRating,
      facilitiesRating,
      careerGrowthRating,
      comment,
    } = body;

    const employee = await prisma.employee.findFirst({
      where: { userId, companyId },
      orderBy: { createdAt: "desc" },
    });

    if (!employee) {
      throw new ApiError("You are not an employee of this company", 404);
    }

    const existingCompanyReview = await prisma.companyReview.findFirst({
      where: { userId, companyId: employee.companyId },
    });

    if (existingCompanyReview) {
      throw new ApiError("You have already submitted a company review", 400);
    }

    const overallRating =
      (workCultureRating +
        workLifeBalanceRating +
        facilitiesRating +
        careerGrowthRating) /
      4;

    const companyReview = await prisma.companyReview.create({
      data: {
        userId,
        companyId: employee.companyId,
        salaryEstimate,
        workCultureRating,
        workLifeBalanceRating,
        facilitiesRating,
        careerGrowthRating,
        overallRating,
        comment,
      },
    });

    return {
      companyReview,
      messages: "Company review created successfully",
    };
  } catch (error) {
    throw error;
  }
};
