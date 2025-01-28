import { prisma } from "../../lib/prisma";

export const getJobService = async (id: number) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        companyLocation: {
          select: {
            address: true,
            regency: {
              select: {
                regency: true,
              },
            },
          },
        },
      },
    });

    if (!job) {
      throw new Error("Job not found");
    }

    return job;
  } catch (error) {
    throw error;
  }
};
