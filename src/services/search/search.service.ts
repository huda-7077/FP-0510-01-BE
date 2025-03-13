import { prisma } from "../../lib/prisma";

export interface Suggestion {
  id: number;
  title: string;
}

export interface Suggestions {
  jobs: Suggestion[];
  companies: Suggestion[];
}

export const searchService = {
  async getSearchSuggestions(query: string): Promise<Suggestions> {
    try {
      const jobs = await prisma.job.findMany({
        where: {
          AND: [
            {
              OR: [
                { title: { contains: query, mode: "insensitive" } },
                { tags: { has: query } },
              ],
            },
            { isPublished: true },
            { applicationDeadline: { gt: new Date() } },
            { isDeleted: false },
          ],
        },
        select: {
          id: true,
          title: true,
          slug: true,
        },
        take: 5,
      });

      const companiesRaw = await prisma.company.findMany({
        where: {
          name: { contains: query, mode: "insensitive" },
          isDeleted: false,
        },
        select: {
          id: true,
          name: true,
          slug: true,
        },
        take: 5,
      });

      const companies = companiesRaw.map((company) => ({
        id: company.id,
        title: company.name,
        slug: company.slug,
      }));

      return { jobs, companies };
    } catch (error) {
      throw new Error("Failed to fetch search suggestions");
    }
  },
};
