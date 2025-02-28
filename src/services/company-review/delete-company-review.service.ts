import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

export const deleteCompanyReviewService = async (
  userId: number,
  reviewId: number
) => {
  try {
    const existingCompanyReview = await prisma.companyReview.findFirst({
      where: { id: reviewId },
    });

    if (!existingCompanyReview) {
      throw new ApiError("Company review not found", 404);
    }

    if (existingCompanyReview.userId !== userId) {
      throw new ApiError(
        "You are not authorized to delete this company review",
        403
      );
    }

    await prisma.companyReview.delete({
      where: {
        id: reviewId,
      },
    });

    return {
      messages: `Company review #${reviewId} deleted successfully`,
    };
  } catch (error) {
    throw error;
  }
};
