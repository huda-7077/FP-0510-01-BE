import { UserAssessment } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export const createUserAssessmentService = async (
  body: Omit<UserAssessment, "score">
) => {
  const { id, assessmentId, userId } = body;

  const existingUserAssessment = await prisma.userAssessment.findFirst({
    where: { id, assessmentId, userId }, // User ID nanti diganti pakai res.locals.user.id
  });

  if (existingUserAssessment) {
    throw new Error("User assessment already exists.");
  }

  return await prisma.userAssessment.create({
    data: {
      score: 0,
      ...body,
    },
  });
};
