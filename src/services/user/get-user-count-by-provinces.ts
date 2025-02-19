import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUsersCountByProvinceService = async () => {
  try {
    const userCountByProvince = await prisma.$queryRaw<
      { province: string; users: number }[]
    >`
      SELECT 
        p.province AS province,
        COUNT(u.id) AS users
      FROM 
        users u
      LEFT JOIN 
        regencies r ON "regencyId" = r.id
      LEFT JOIN 
        provinces p ON "provinceId" = p.id
      WHERE 
        "isDeleted" = false AND
        u.role = 'USER' AND
        p.province IS NOT NULL
      GROUP BY 
        p.province
    `;

    const result = userCountByProvince.map((item: any) => ({
      province: item.province || "Unknown",
      users: Number(item.users),
    }));

    return { data: result };
  } catch (error) {
    console.error("Error fetching users count by province:", error);
    throw error;
  }
};
