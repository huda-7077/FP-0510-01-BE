import { prisma } from "../../lib/prisma";
import { redisClient } from "../../lib/redis";

export const getUsersCountByAgeRangesService = async () => {
  try {
    const cachedAgeRangesData = await redisClient.get("ageRangesData");

    if (cachedAgeRangesData) {
      return JSON.parse(cachedAgeRangesData);
    }

    const users = await prisma.user.findMany({
      where: { isDeleted: false, role: "USER" },
      select: {
        dateOfBirth: true,
      },
    });

    const calculateAge = (dateOfBirth: Date): number => {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      return age;
    };

    const ageRanges = [
      { age: "<17", userAges: 0 },
      { age: "18-24", userAges: 0 },
      { age: "25-34", userAges: 0 },
      { age: "35-44", userAges: 0 },
      { age: "45-54", userAges: 0 },
      { age: "55-64", userAges: 0 },
      { age: "65+", userAges: 0 },
    ];

    users.forEach((user) => {
      if (user.dateOfBirth) {
        const age = calculateAge(user.dateOfBirth);

        if (age < 17) {
          ageRanges[0].userAges++;
        } else if (age >= 18 && age <= 24) {
          ageRanges[1].userAges++;
        } else if (age >= 25 && age <= 34) {
          ageRanges[2].userAges++;
        } else if (age >= 35 && age <= 44) {
          ageRanges[3].userAges++;
        } else if (age >= 45 && age <= 54) {
          ageRanges[4].userAges++;
        } else if (age >= 55 && age <= 64) {
          ageRanges[5].userAges++;
        } else if (age >= 65) {
          ageRanges[6].userAges++;
        }
      }
    });

    await redisClient.setEx(
      "ageRangesData",
      3600,
      JSON.stringify({ data: ageRanges })
    );

    return { data: ageRanges };
  } catch (error) {
    console.error("Error fetching age ranges:", error);
    throw error;
  }
};
