import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

export const getInterviewService = async (id: number, userId: number) => {
  try {
    // Fetch the interview by its ID
    const interview = await prisma.interview.findUnique({
      where: { id },
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

    // Fetch the requesting user's details
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        isDeleted: false,
      },
    });

    if (!user) {
      throw new ApiError("User Not Found", 404);
    }

    // Check access permissions based on the user's role
    if (user.role === "ADMIN") {
      // Admins can only access interviews from their own company
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
      // Users can only access interviews related to their userId
      if (user.id !== interview.jobApplication.user.id) {
        throw new ApiError(
          "Unauthorized Access: User cannot access interviews of other users",
          403
        );
      }
    } else {
      throw new ApiError("Unauthorized Role", 403);
    }

    // If access is granted, return the full interview details
    const fullInterview = await prisma.interview.findUnique({
      where: { id },
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
