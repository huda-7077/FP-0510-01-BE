import { comparePassword } from "../../lib/argon";
import { prisma } from "../../lib/prisma";

export const deleteAccountService = async (
  userId: number,
  password: string
) => {
  const user = await prisma.user.findFirst({
    where: { id: userId, isDeleted: false },
  });

  if (!user) {
    throw new Error("Invalid user id");
  }

  if (user.isVerified === false) {
    throw new Error("Your account is not verified");
  }

  if (!user.password) {
    throw new Error("Cannot delete account for Google login users");
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { isDeleted: true, isVerified: false },
  });

  return {
    message: "Account deleted successfully. Our doors are always open for you!",
  };
};
