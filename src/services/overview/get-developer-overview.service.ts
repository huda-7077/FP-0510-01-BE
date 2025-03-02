import { prisma } from "../../lib/prisma";

export const getDeveloperOverviewService = async () => {
  try {
    const totalUsers = await prisma.user.count();
    const verifiedUsers = await prisma.user.count({
      where: {
        isVerified: true,
      },
    });

    const totalSubscriptions = await prisma.subscription.count();
    const activeSubscriptions = await prisma.subscription.count({
      where: {
        status: "ACTIVE",
      },
    });

    const totalJobsPublished = await prisma.job.count({
      where: {
        isPublished: true,
      },
    });

    const totalCompanies = await prisma.company.count();
    const totalSkillAssessmentsPublished = await prisma.skillAssessment.count({
      where: {
        status: "PUBLISHED",
      },
    });
    const totalPaidPayments = await prisma.payment.count({
      where: {
        status: "PAID",
      },
    });

    return {
      totalUsers,
      verifiedUsers,
      totalSubscriptions,
      activeSubscriptions,
      totalJobsPublished,
      totalCompanies,
      totalSkillAssessmentsPublished,
      totalPaidPayments,
    };
  } catch (error) {
    throw error;
  }
};
