import { SkillAssessmentUserAttemptStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";
import { BASE_URL_FE } from "../../config";

export const autoSubmitUserAnswersService = async (
  userId: number,
  attemptId: number
) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const attempt = await tx.skillAssessmentUserAttempt.findUnique({
        where: { id: attemptId },
        include: { skillAssessmentUserAnswer: true },
      });

      if (!attempt || attempt.userId !== userId) {
        throw new ApiError("Invalid attempt", 403);
      }

      const skillAssessment = await tx.skillAssessment.findUnique({
        where: { id: attempt.skillAssessmentId },
      });

      if (!skillAssessment) {
        throw new ApiError("Skill assessment not found", 404);
      }

      const elapsedTime = Date.now() - new Date(attempt.createdAt).getTime();
      if (elapsedTime < 30 * 60 * 1000) {
        throw new ApiError("Time is not up yet", 400);
      }

      const correctAnswers = await tx.skillAssessmentUserAnswer.count({
        where: {
          skillAssessmentUserAttemptId: attemptId,
          skillAssessmentOption: {
            isCorrect: true,
          },
        },
      });

      const score = (correctAnswers / 25) * 100;

      if (score >= skillAssessment.passingScore) {
        const certificate = await tx.certificate.create({
          data: {
            userId,
            skillAssessmentUserAttemptId: attemptId,
          },
        });

        const updatedCertificate = await tx.certificate.update({
          where: { id: certificate.id },
          data: {
            certificateUrl: `${BASE_URL_FE}/certificates/${skillAssessment.slug}/${certificate.uuid}`,
          },
        });

        await tx.userBadge.create({
          data: {
            userId,
            certificateId: updatedCertificate.id,
            badgeName: `${skillAssessment.title} Badge`,
            badgeImage: skillAssessment.badgeImage,
            description: `Finished ${skillAssessment.title} assessment and got a certificate`,
          },
        });

        await tx.skillAssessmentUserAttempt.update({
          where: { id: attemptId },
          data: {
            isPassed: true,
          },
        });
      }

      await tx.skillAssessmentUserAttempt.update({
        where: { id: attemptId },
        data: {
          correctAnswer: correctAnswers,
          status: SkillAssessmentUserAttemptStatus.ENDED,
        },
      });

      return { message: "Auto-submitted successfully", correctAnswers };
    });
  } catch (error) {
    throw error;
  }
};
