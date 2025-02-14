import { Interview } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";
import sendInterviewReminderEmail from "../../lib/handlebars/sendInterviewReminderEmail";

export const createInterviewService = async (body: Interview) => {
  const { jobApplicationId } = body;

  try {
    return await prisma.$transaction(async (tx) => {
      const existingInterview = await tx.interview.findFirst({
        where: { jobApplicationId },
      });

      if (existingInterview) {
        throw new ApiError(
          `Interview schedule with job application #${jobApplicationId} already exists`,
          409
        );
      }

      const interview = await tx.interview.create({
        data: { ...body },
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
        where: { id: jobApplicationId },
        data: {
          status: "INTERVIEW_SCHEDULED",
        },
      });

      sendInterviewReminderEmail({
        applicant_name: interview.jobApplication.user.fullName,
        email: interview.jobApplication.user.email,
        position: interview.jobApplication.job.title,
        company_name: interview.jobApplication.job.company.name,
        scheduledDate: interview.scheduledDate,
        interviewerName: interview.interviewerName,
        location: interview.location,
        company_logo: interview.jobApplication.job.company.logo || undefined,
      });

      return interview;
    });
  } catch (error) {
    //! Log unexpected errors for debugging purposes
    console.error("Unexpected error during interview creation:", error);

    throw new ApiError(
      "An unexpected error occurred while creating the interview",
      400
    );
  }
};
