import { prisma } from "../../lib/prisma";
import { redisClient } from "../../lib/redis";

export const getDeveloperOverviewService = async () => {
  try {
    const cachedData = await redisClient.get("developerOverviewData");
    if (cachedData) {
      return JSON.parse(cachedData);
    }

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

    const overviewData = {
      totalUsers,
      verifiedUsers,
      totalSubscriptions,
      activeSubscriptions,
      totalJobsPublished,
      totalCompanies,
      totalSkillAssessmentsPublished,
      totalPaidPayments,
    };

    await redisClient.setEx(
      "developerOverviewData",
      30 * 60,
      JSON.stringify(overviewData)
    );

    return overviewData;
  } catch (error) {
    throw error;
  }
};
