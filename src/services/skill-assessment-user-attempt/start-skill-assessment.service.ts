import { SubscriptionStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

export const startSkillAssessmentService = async (
  userId: number,
  slug: string
) => {
  return await prisma.$transaction(async (tx) => {
    const userSubscription = await tx.subscription.findFirst({
      where: {
        userId,
        status: {
          in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.MAILED],
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!userSubscription) {
      throw new ApiError("You have no active subscription", 400);
    }

    if (userSubscription.assessmentLimit === 0) {
      throw new ApiError(
        "You have reached the maximum number of assessments",
        400
      );
    }

    const skillAssessment = await tx.skillAssessment.findUnique({
      where: { slug },
    });

    if (!skillAssessment) {
      throw new ApiError("Skill assessment not found", 404);
    }

    const existingAttempt = await tx.skillAssessmentUserAttempt.findFirst({
      where: {
        userId,
        skillAssessmentId: skillAssessment.id,
        createdAt: {
          gte: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
      },
      select: { isPassed: true },
    });

    if (existingAttempt?.isPassed) {
      throw new ApiError("You already passed this assessment", 400);
    }

    if (existingAttempt) {
      throw new ApiError(
        "You already finished this assessment, try again at a later time",
        400
      );
    }

    const newAttempt = await tx.skillAssessmentUserAttempt.create({
      data: {
        userId,
        skillAssessmentId: skillAssessment.id,
      },
    });

    return newAttempt;
  });
};
