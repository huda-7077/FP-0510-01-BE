import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export type TimeRange =
  | "Last 7 days"
  | "Last 3 months"
  | "Last 12 months"
  | "Last 3 years"
  | "Last 5 years";

export const getPopularJobCategoriesService = async (timeRange: TimeRange) => {
  try {
    let startDate: Date | undefined;
    const now = new Date();

    switch (timeRange) {
      case "Last 7 days":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "Last 3 months":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "Last 12 months":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      case "Last 3 years":
        startDate = new Date(now.getTime() - 3 * 365 * 24 * 60 * 60 * 1000);
        break;
      case "Last 5 years":
        startDate = new Date(now.getTime() - 5 * 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        throw new Error("Invalid time range specified.");
    }

    const popularJobCategories = await prisma.$queryRaw<
      { category: string; applicants: number }[]
    >(Prisma.sql`
      SELECT
        j.category AS category,
        COUNT(ja.id) AS applicants
      FROM 
        jobs j
      LEFT JOIN 
        job_applications ja ON ja."jobId" = j.id
      WHERE 
        j."isDeleted" = FALSE
        ${
          startDate
            ? Prisma.sql`AND ja."createdAt" >= ${startDate}`
            : Prisma.empty
        }
      GROUP BY 
        j.category
      ORDER BY 
        applicants DESC
      LIMIT 10
    `);

    const result = popularJobCategories.map((item: any) => ({
      category: item.category || "Unknown",
      applicants: Number(item.applicants),
    }));

    return { data: result };
  } catch (error) {
    console.error("Error fetching popular job categories:", error);
    throw error;
  }
};
