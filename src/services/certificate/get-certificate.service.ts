import { prisma } from "../../lib/prisma";

export const getCertificateService = async (slug: string, uuid: string) => {
  try {
    const certificate = await prisma.certificate.findFirst({
      where: { uuid, userSkillAssessment: { skillAssessment: { slug } } },
      select: {
        certificateUrl: true,
        user: {
          select: { fullName: true },
        },
        userSkillAssessment: {
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

    const { userSkillAssessment, user, ...others } = certificate;

    return {
      ...others,
      fullName: user.fullName,
      title: userSkillAssessment.skillAssessment.title,
      badgeImage: userSkillAssessment.skillAssessment.badgeImage,
    };
  } catch (error) {
    throw error;
  }
};
