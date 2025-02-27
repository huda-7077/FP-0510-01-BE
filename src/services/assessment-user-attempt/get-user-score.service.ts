import sendApplicationRejectionEmail from "../../lib/handlebars/sendApplicationRejectionEmail";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

export const getUserScoreService = async (
  userId: number,
  attemptId: number
) => {
  try {
    const userPreTestAssessment = await prisma.$transaction(async (tx) => {
      const attempt = await tx.preTestAssessmentUserAttempt.findUnique({
        where: { id: attemptId },
        include: {
          preTestAssessmentUserAnswer: {
            include: { preTestAssessmentOption: true },
          },
          preTestAssessment: { select: { slug: true, passingScore: true } },
        },
      });

      if (!attempt || attempt.userId !== userId) {
        throw new ApiError("Invalid attempt or not found", 403);
      }

      const correctAnswers = attempt.preTestAssessmentUserAnswer.filter(
        (answer) => answer.preTestAssessmentOption.isCorrect
      ).length;

      const totalQuestions = await tx.preTestAssessmentQuestion.count({
        where: { preTestAssessmentId: attempt.preTestAssessmentId },
      });

      const score =
        totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

      const userPreTestAssessment = await tx.userPreTestAssessment.create({
        data: {
          userId,
          preTestAssessmentId: attempt.preTestAssessmentId,
          score,
        },
        include: {
          preTestAssessment: {
            include: {
              job: {
                include: { company: { select: { name: true, logo: true } } },
              },
            },
          },
          user: { select: { email: true, fullName: true } },
        },
      });

      const jobApplicationResult = await tx.$queryRaw<{ id: number }[]>`
        SELECT id FROM job_applications 
        WHERE "userId" = ${userPreTestAssessment.userId} 
          AND "jobId" = ${userPreTestAssessment.preTestAssessment.jobId}
      `;

      const jobApplicationId = jobApplicationResult.length
        ? jobApplicationResult[0].id
        : 0;

      if (jobApplicationId === 0) {
        throw new Error("Job application not found.");
      }

      if (score < attempt.preTestAssessment.passingScore) {
        await tx.jobApplication.update({
          where: { id: jobApplicationId },
          data: {
            status: "REJECTED",
          },
        });
      }

      return userPreTestAssessment;
    });

    if (
      userPreTestAssessment.score <
      userPreTestAssessment.preTestAssessment.passingScore
    ) {
      try {
        await sendApplicationRejectionEmail({
          email: userPreTestAssessment.user.email,
          position: userPreTestAssessment.preTestAssessment.job.title,
          company_name:
            userPreTestAssessment.preTestAssessment.job.company.name,
          applicant_name: userPreTestAssessment.user.fullName,
          company_logo:
            userPreTestAssessment.preTestAssessment.job.company.logo ||
            undefined,
        });
      } catch (error) {
        console.error("Failed to send application rejection email:", error);
      }
    }

    return userPreTestAssessment;
  } catch (error) {
    throw error;
  }
};
