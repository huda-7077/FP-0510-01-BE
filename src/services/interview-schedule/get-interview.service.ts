import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

export const getInterviewService = async (id: number, userId: number) => {
  try {
    const interview = await prisma.interview.findUnique({
      where: { id, isDeleted: false },
      include: {
        jobApplication: {
          include: {
            user: {
              select: {
                id: true,
                companyId: true,
                role: true,
              },
            },
            job: {
              select: {
                companyId: true,
              },
            },
          },
        },
      },
    });

    if (!interview) {
      throw new ApiError("Interview Not Found", 404);
    }

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        isDeleted: false,
      },
    });

    if (!user) {
      throw new ApiError("User Not Found", 404);
    }

    if (user.role === "ADMIN") {
      if (
        !user.companyId ||
        user.companyId !== interview.jobApplication.job.companyId
      ) {
        throw new ApiError(
          "Unauthorized Access: Admin cannot access interviews from other companies",
          403
        );
      }
    } else if (user.role === "USER") {
      if (user.id !== interview.jobApplication.user.id) {
        throw new ApiError(
          "Unauthorized Access: User cannot access interviews of other users",
          403
        );
      }
    } else {
      throw new ApiError("Unauthorized Role", 403);
    }

    const fullInterview = await prisma.interview.findUnique({
      where: { id, isDeleted: false },
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

    return fullInterview;
  } catch (error: any) {
    throw new ApiError(
      error.message || "There is a problem fetching data",
      error.statusCode || 400
    );
  }
};
