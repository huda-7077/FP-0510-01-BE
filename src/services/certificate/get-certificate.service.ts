import { prisma } from "../../lib/prisma";

export const getCertificateService = async (slug: string, uuid: string) => {
  try {
    const certificate = await prisma.certificate.findFirst({
      where: {
        uuid,
        skillAssessmentUserAttempt: { skillAssessment: { slug } },
      },
      select: {
        certificateUrl: true,
        user: {
          select: { fullName: true },
        },
        skillAssessmentUserAttempt: {
          select: {
            skillAssessment: {
              select: { title: true, badgeImage: true },
            },
          },
        },
        createdAt: true,
      },
    });

    if (!certificate) {
      throw new Error("certificate not found");
    }

    const { skillAssessmentUserAttempt, user, ...others } = certificate;

    return {
      ...others,
      fullName: user.fullName,
      title: skillAssessmentUserAttempt.skillAssessment.title,
      badgeImage: skillAssessmentUserAttempt.skillAssessment.badgeImage,
    };
  } catch (error) {
    throw error;
  }
};
