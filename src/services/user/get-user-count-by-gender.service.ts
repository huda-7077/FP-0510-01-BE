import { prisma } from "../../lib/prisma";
import { redisClient } from "../../lib/redis";

export const getUserCountByGenderService = async () => {
  try {
    const cachedUserGenderCountData = await redisClient.get(
      "userGenderCountData"
    );

    if (cachedUserGenderCountData) {
      return JSON.parse(cachedUserGenderCountData);
    }

    const users = await prisma.user.findMany({
      where: { isDeleted: false, role: "USER" },
      select: {
        gender: true,
      },
    });

    const genderCount = [
      { gender: "male", userGenders: 0, fill: "#2462eb" },
      { gender: "female", userGenders: 0, fill: "#4AA9FF" },
    ];

    users.forEach((user) => {
      if (user.gender) {
        const gender = user.gender;

        if (gender === "MALE") {
          genderCount[0].userGenders++;
        } else if (gender === "FEMALE") {
          genderCount[1].userGenders++;
        }
      }
    });

    await redisClient.setEx(
      "userGenderCountData",
      3600,
      JSON.stringify({ data: genderCount })
    );

    return { data: genderCount };
  } catch (error) {
    console.error("Error fetching age ranges:", error);
    throw error;
  }
};
