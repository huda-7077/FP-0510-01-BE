import { prisma } from "../../lib/prisma";

export const getIndustriesService = async () => {
  try {
    const industries = await prisma.company.findMany({
      select: {
        industry: true,
      },
      distinct: ["industry"],
      orderBy: {
        industry: "asc",
      },
    });

    const industryList = industries
      .map((item) => item.industry)
      .filter((industry): industry is string => !!industry);

    return industryList;
  } catch (error) {
    throw new Error("Failed to fetch industries");
  }
};
