import { JobApplication } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import sendAssessmentReminderEmail from "../../lib/handlebars/sendAssessmentReminderEmail";
import { BASE_URL_FE } from "../../config";
import sendApplicationAcceptanceEmail from "../../lib/handlebars/sendApplicationAcceptanceEmail";
import sendApplicationRejectionEmail from "../../lib/handlebars/sendApplicationRejectionEmail";
import { ApiError } from "../../utils/apiError";

interface UpdateJobApplicationBody {
  jobId?: number;
  userId?: number;
  status?: JobApplication["status"];
}

export const updateJobApplicationService = async (
  body: UpdateJobApplicationBody,
  id: number
) => {
  try {
    if (!id || id <= 0) {
      throw new ApiError("Invalid job application ID.", 404);
    }

    const { status } = body;

    const result = await prisma.$transaction(async (prisma) => {
      const existingJobApplication = await prisma.jobApplication.findUnique({
        where: { id },
      });

      if (!existingJobApplication) {
        throw new ApiError("Job application not found.", 404);
      }

      const updatedJobApplication = await prisma.jobApplication.update({
        where: { id },
        data: {
          ...body,
        },
        include: {
          user: {
            select: {
              email: true,
              fullName: true,
            },
          },
          job: {
            select: {
              title: true,
              requiresAssessment: true,
              company: {
                select: {
                  name: true,
                  logo: true,
                },
              },
              preTestAssessments: {
                select: {
                  id: true,
                  slug: true,
                },
              },
            },
          },
        },
      });

      if (
        status === "IN_REVIEW" &&
        updatedJobApplication.job.requiresAssessment
      ) {
        const assessmentId =
          updatedJobApplication.job.preTestAssessments[0]?.id;

        if (!assessmentId) {
          throw new ApiError("No assessment available for this job.", 404);
        }
      }

      return { updatedJobApplication };
    });

    const { updatedJobApplication } = result;

    if (
      status === "IN_REVIEW" &&
      updatedJobApplication.job.requiresAssessment
    ) {
      try {
        sendAssessmentReminderEmail({
          email: updatedJobApplication.user.email,
          position: updatedJobApplication.job.title,
          company_name: updatedJobApplication.job.company.name,
          applicant_name: updatedJobApplication.user.fullName,
          company_logo: updatedJobApplication.job.company.logo || undefined,
          assessment_url: `${BASE_URL_FE}/pre-test-assessment/${updatedJobApplication.job.preTestAssessments[0].slug}`,
        });
      } catch (emailError) {
        console.error("Failed to send assessment reminder email:", emailError);
      }
    } else if (status === "ACCEPTED") {
      try {
        sendApplicationAcceptanceEmail({
          email: updatedJobApplication.user.email,
          position: updatedJobApplication.job.title,
          company_name: updatedJobApplication.job.company.name,
          applicant_name: updatedJobApplication.user.fullName,
          company_logo: updatedJobApplication.job.company.logo || undefined,
        });
      } catch (emailError) {
        console.error(
          "Failed to send application acceptance email:",
          emailError
        );
      }
    } else if (status === "REJECTED") {
      try {
        sendApplicationRejectionEmail({
          email: updatedJobApplication.user.email,
          position: updatedJobApplication.job.title,
          company_name: updatedJobApplication.job.company.name,
          applicant_name: updatedJobApplication.user.fullName,
          company_logo: updatedJobApplication.job.company.logo || undefined,
        });
      } catch (emailError) {
        console.error(
          "Failed to send application rejection email:",
          emailError
        );
      }
    }

    return result;
  } catch (error) {
    throw error;
  }
};
