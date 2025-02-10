import { User } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export const changeEmailService = async (body: User, userId: number) => {
  try {
    const newEmail = body.email.toLowerCase();

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
      throw new Error("Cannot change email for Google login users");
    }

    if (user.email === newEmail) {
      throw new Error("You've entered your current email");
    }

    const existingEmail = await prisma.user.findUnique({
      where: {
        email: newEmail,
      },
    });

    if (existingEmail) {
      throw new Error("Email is taken. Please choose another email.");
    }

    await prisma.user.update({
      where: { id: userId },
      data: { email: newEmail, isVerified: false },
    });

    return {
      message: "Email has been updated, please verify your email",
      data: newEmail,
    };
  } catch (error) {
    throw error;
  }
};
