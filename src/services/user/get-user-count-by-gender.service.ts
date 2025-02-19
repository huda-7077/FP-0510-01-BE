import { prisma } from "../../lib/prisma";

export const getUserCountByGenderService = async () => {
  try {
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

    return { data: genderCount };
  } catch (error) {
    console.error("Error fetching age ranges:", error);
    throw error;
  }
};
