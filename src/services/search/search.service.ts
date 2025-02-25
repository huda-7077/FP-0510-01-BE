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
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { tags: { has: query } },
          ],
        },
        select: {
          id: true,
          title: true,
        },
        take: 5,
      });

      const companiesRaw = await prisma.company.findMany({
        where: {
          name: { contains: query, mode: "insensitive" },
        },
        select: {
          id: true,
          name: true,
        },
        take: 5,
      });

      const companies = companiesRaw.map((company) => ({
        id: company.id,
        title: company.name,
      }));

      return { jobs, companies };
    } catch (error) {
      throw new Error("Failed to fetch search suggestions");
    }
  },
};
