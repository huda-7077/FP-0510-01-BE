import { comparePassword, hashPassword } from "../../lib/argon";
import { prisma } from "../../lib/prisma";

interface changePasswordBody {
  password: string;
  newPassword: string;
}

export const changePasswordService = async (
  userId: number,
  body: changePasswordBody
) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId, isDeleted: false },
    });

    if (!user) {
      throw new Error("Invalid user id");
    }

    if (!user.password) {
      throw new Error("Cannot change password for Google login users");
    }

    if (user.isVerified === false) {
      throw new Error("Your account is not verified");
    }

    const { password, newPassword } = body;

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    if (password === newPassword) {
      throw new Error("You've entered the same password");
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: "Password has been changed successfully" };
  } catch (error) {
    throw error;
  }
};
