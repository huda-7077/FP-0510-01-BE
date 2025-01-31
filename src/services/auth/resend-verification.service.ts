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
      const timeSinceLastToken = Date.now() - lastToken.createdAt.getTime();

      if (timeSinceLastToken < cooldownPeriod) {
        const remainingTime = Math.ceil(
          (cooldownPeriod - timeSinceLastToken) / 1000
        );
        throw new Error(
          `Please wait ${remainingTime} seconds before requesting a new verification email`
        );
      }
    }

    await sendVerificationToken(user.id, user.email, user.fullName);

    return { message: "Verification email resent successfully" };
  } catch (error) {
    throw error;
  }
};
