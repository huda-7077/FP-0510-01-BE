import { UserAssessment } from "@prisma/client";
import sendApplicationRejectionEmail from "../../lib/handlebars/sendApplicationRejectionEmail";
import { prisma } from "../../lib/prisma";

interface UpdateUserAssessmentBody {
  score?: number;
  status: UserAssessment["status"];
}

export const updateUserAssessmentService = async (
  id: number,
  body: UpdateUserAssessmentBody
) => {
  const transaction = await prisma.$transaction(
    async (prisma) => {
      const existingUserAssessment = await prisma.userAssessment.findFirst({
        where: { id },
        include: {
          user: {
            select: {
              fullName: true,
              email: true,
            },
          },
          assessment: {
            include: {
              job: {
                include: {
                  company: true,
                },
              },
            },
          },
        },
      });

      if (!existingUserAssessment) {
        throw new Error("You do not have access to this assessment.");
      }

      if (existingUserAssessment.status === "DONE") {
        throw new Error(
          "Cannot redo an assessment. The assessment is already completed."
        );
      }

      const allowedStatuses = ["PENDING", "STARTED", "ON_DOING"];
      if (!allowedStatuses.includes(existingUserAssessment.status)) {
        if (existingUserAssessment.status === "EXPIRED") {
          throw new Error("The assessment link has expired.");
        } else {
          throw new Error("Cannot redo an assessment.");
        }
      }

      const updateUserAssessment = await prisma.userAssessment.update({
        where: { id },
        data: {
          score: body.score || existingUserAssessment.score,
          status: body.status,
        },
      });

      const jobApplicationResult = await prisma.$queryRaw<
        { id: number }[]
      >`SELECT id FROM job_applications WHERE "userId" = ${existingUserAssessment.userId} AND "jobId" = ${existingUserAssessment.assessment.jobId}`;

      const jobApplicationId = jobApplicationResult.length
        ? jobApplicationResult[0].id
        : 0;

      if (jobApplicationId === 0) {
        throw new Error("Job application not found.");
      }

      if (
        body.score &&
        updateUserAssessment.score <
          existingUserAssessment.assessment.passingScore
      ) {
        await prisma.jobApplication.update({
          where: { id: jobApplicationId },
          data: {
            status: "REJECTED",
            notes:
              "Assessment score is less than passing score. Good luck next time!",
          },
        });

        await sendApplicationRejectionEmail({
          email: existingUserAssessment.user.email,
          position: existingUserAssessment.assessment.job.title,
          company_name: existingUserAssessment.assessment.job.company.name,
          applicant_name: existingUserAssessment.user.fullName,
          company_logo:
            existingUserAssessment.assessment.job.company.logo || undefined,
        });
      }

      return updateUserAssessment;
    },
    {
      timeout: 10000,
    }
  );

  return transaction;
};
