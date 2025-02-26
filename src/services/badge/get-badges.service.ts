import { prisma } from "../../lib/prisma";

interface GetBadgesQuery {
  page: number;
  take: number;
}
export const getBadgesService = async (
  userId: number,
  query: GetBadgesQuery
) => {
  try {
    const { page, take } = query;

    const badges = await prisma.userBadge.findMany({
      where: { userId },
      skip: (page - 1) * take,
      take: take,
      orderBy: {
        ["awardedAt"]: "desc",
      },
      include: { certificate: { select: { certificateUrl: true } } },
    });

    const count = await prisma.userBadge.count({
      where: { userId },
    });

    return {
      data: badges,
      meta: { page, take, total: count },
    };
  } catch (error) {
    throw error;
  }
};
