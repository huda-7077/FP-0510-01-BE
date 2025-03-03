import { prisma } from "../../lib/prisma";

export const getOverviewService = async () => {
  try {
    const currentDate = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const liveJobs = await prisma.job.count({
      where: { 
        isPublished: true, 
        isDeleted: false,
        applicationDeadline: { gte: currentDate }
      },
    });

    const companies = await prisma.company.count({
      where: { isDeleted: false },
    });

    const candidates = await prisma.user.count({
      where: { role: "USER" },
    });

    const newJobs = await prisma.job.count({
      where: { 
        createdAt: { gte: oneWeekAgo },
        isPublished: true,
        isDeleted: false 
      },
    });

    return {
      liveJobs,
      companies,
      candidates,
      newJobs
    };
  } catch (error) {
    throw error;
  }
};