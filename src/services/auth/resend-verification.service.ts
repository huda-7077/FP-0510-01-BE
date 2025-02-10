import { prisma } from "../../lib/prisma";
import { sendVerificationToken } from "./verification.service";

export const resendVerificationToken = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.isVerified) {
      throw new Error("Email already verified");
    }

    const lastToken = await prisma.verificationToken.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (lastToken) {
      const cooldownPeriod = 60 * 1000;
      const nextAllowedTime = new Date(
        lastToken.createdAt.getTime() + cooldownPeriod
      );
      const now = new Date();

      if (now < nextAllowedTime) {
        throw {
          message: `Please wait ${Math.ceil(
            (nextAllowedTime.getTime() - now.getTime()) / 1000
          )} seconds`,
          nextAllowedTime: nextAllowedTime.toISOString(),
        };
      }
    }

    await sendVerificationToken(user.id, user.email, user.fullName);

    return { message: "Verification email sent successfully" };
  } catch (error) {
    throw error;
  }
};
