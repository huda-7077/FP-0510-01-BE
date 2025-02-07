import { JobApplication } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import sendAssessmentReminderEmail from "../../lib/handlebars/sendAssessmentReminderEmail";
import { BASE_URL_FE } from "../../config";
import sendApplicationAcceptanceEmail from "../../lib/handlebars/sendApplicationAcceptanceEmail";
import sendApplicationRejectionEmail from "../../lib/handlebars/sendApplicationRejectionEmail";

interface UpdateJobApplicationBody {
  jobId?: number;
  userId?: number;
  cvFile?: string;
  attachment?: string;
  expectedSalary?: number;
  status?: JobApplication["status"];
  notes?: string;
}

export const updateJobApplicationService = async (
  body: UpdateJobApplicationBody,
  id: number
) => {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const existingJobApplication = await prisma.jobApplication.findUnique({
        where: { id },
      });

      if (!existingJobApplication) {
        throw new Error("Job application not found");
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
              assessments: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });

      if (
        body.status === "IN_REVIEW" &&
        updatedJobApplication.job.requiresAssessment
      ) {
        const assessmentId = updatedJobApplication.job.assessments[0].id;
        const userId = updatedJobApplication.userId;

        const existingUserAssessment = await prisma.userAssessment.findFirst({
          where: { assessmentId, userId },
        });

        if (existingUserAssessment) {
          throw new Error("User assessment already exists.");
        }

        await prisma.userAssessment.create({
          data: {
            assessmentId,
            userId,
            score: 0,
          },
        });
      }

      return { updatedJobApplication };
    });

    const { updatedJobApplication } = result;

    if (
      body.status === "IN_REVIEW" &&
      updatedJobApplication.job.requiresAssessment
    ) {
      try {
        await sendAssessmentReminderEmail({
          email: updatedJobApplication.user.email,
          position: updatedJobApplication.job.title,
          company_name: updatedJobApplication.job.company.name,
          applicant_name: updatedJobApplication.user.fullName,
          company_logo: updatedJobApplication.job.company.logo || undefined,
          assessment_url: `${BASE_URL_FE}/pre-test-assessment/${updatedJobApplication.job.assessments[0].id}`,
        });
      } catch (error) {
        console.error("Failed to send assessment reminder email:", error);
      }
    }

    if (body.status === "ACCEPTED") {
      try {
        await sendApplicationAcceptanceEmail({
          email: updatedJobApplication.user.email,
          position: updatedJobApplication.job.title,
          company_name: updatedJobApplication.job.company.name,
          applicant_name: updatedJobApplication.user.fullName,
          company_logo: updatedJobApplication.job.company.logo || undefined,
        });
      } catch (error) {
        console.error("Failed to send application acceptance email:", error);
      }
    } else if (body.status === "REJECTED") {
      try {
        await sendApplicationRejectionEmail({
          email: updatedJobApplication.user.email,
          position: updatedJobApplication.job.title,
          company_name: updatedJobApplication.job.company.name,
          applicant_name: updatedJobApplication.user.fullName,
          company_logo: updatedJobApplication.job.company.logo || undefined,
        });
      } catch (error) {
        console.error("Failed to send application rejection email:", error);
      }
    }

    return result;
  } catch (error) {
    console.error(`Error in updateJobApplication for id ${id}:`, error);
    throw error;
  }
};
