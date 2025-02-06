import { UserAssessment } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export const createUserAssessmentService = async (
  userId: number,
  body: Omit<UserAssessment, "userId" | "score">
) => {
  const { id, assessmentId } = body;

  const existingUserAssessment = await prisma.userAssessment.findFirst({
    where: { id, assessmentId, userId },
  });

  if (existingUserAssessment) {
    throw new Error("User assessment already exists.");
  }

  return await prisma.userAssessment.create({
    data: {
      userId,
      score: 0,
      ...body,
    },
  });
};
