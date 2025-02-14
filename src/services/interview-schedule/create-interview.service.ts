import { Interview } from "@prisma/client";
import sendInterviewReminderEmail from "../../lib/handlebars/sendInterviewReminderEmail";
import { prisma } from "../../lib/prisma";

export const createInterviewService = async (
  userId: number,
  body: Interview
) => {
  const { jobApplicationId, ...bodyData } = body;

  try {
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

    if (!user) {
      throw new Error("Authentication Failed");
    }

    if (!user.companyId) {
      throw new Error("Authorization Failed");
    }

    const jobApplication = await prisma.jobApplication.findFirst({
      where: { id: jobApplicationId, job: { companyId: user.companyId } },
    });

    if (!jobApplication) {
      throw new Error(
        "Job application not found or you don't have access to this job application"
      );
    }

    return await prisma.$transaction(async (tx) => {
      const existingInterview = await tx.interview.findFirst({
        where: {
          jobApplicationId: jobApplication.id,
        },
      });

      if (existingInterview) {
        // throw new ApiError(
        //   `Interview schedule with job application #${jobApplicationId} already exists`,
        //   409
        // );

        throw new Error(
          "Interview schedule already exists for this applicant."
        );
      }

      const interview = await tx.interview.create({
        data: { jobApplicationId: jobApplication.id, ...bodyData },
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
              job: {
                include: {
                  company: {
                    select: {
                      name: true,
                      logo: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      await tx.jobApplication.update({
        where: { id: jobApplication.id },
        data: {
          status: "INTERVIEW_SCHEDULED",
        },
      });

      sendInterviewReminderEmail({
        email: interview.jobApplication.user.email,
        position: interview.jobApplication.job.title,
        company_name: interview.jobApplication.job.company.name,
        applicant_name: interview.jobApplication.user.fullName,
        company_logo: interview.jobApplication.job.company.logo || undefined,
        scheduledDate: interview.scheduledDate,
        interviewerName: interview.interviewerName,
        location: interview.location,
        meetingLink: interview.meetingLink || undefined,
        notes: interview.notes || undefined,
      });

      return interview;
    });
  } catch (error) {
    //! Log unexpected errors for debugging purposes
    console.error("Unexpected error during interview creation:", error);

    // throw new ApiError(
    //   "An unexpected error occurred while creating the interview",
    //   400
    // );

    throw new Error();
  }
};
