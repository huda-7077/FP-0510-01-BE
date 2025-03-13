import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

export const getJobApplicationService = async (userId: number, id: number) => {
  try {
    const jobApplication = await prisma.jobApplication.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        job: {
          include: {
            company: {
              select: { name: true, logo: true, industry: true, slug: true },
            },
            companyLocation: {
              select: {
                regency: {
                  select: {
                    regency: true,
                    province: { select: { province: true } },
                  },
                },
              },
            },
          },
        },
        user: { select: { email: true, fullName: true } },
        interviews: {
          select: {
            scheduledDate: true,
            interviewerName: true,
            location: true,
            meetingLink: true,
            notes: true,
          },
        },
      },
    });

    if (!jobApplication) {
      throw new ApiError("Job Application not found or not accessible", 403);
    }

    return jobApplication;
  } catch (error) {
    throw error;
  }
};
