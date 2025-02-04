import { prisma } from "../../lib/prisma";
import { hashPassword } from "../../lib/argon";

export const resetPasswordService = async (
  userId: number,
  password: string
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return { message: "Password successfully updated" };
  } catch (error) {
    throw error;
  }
};
