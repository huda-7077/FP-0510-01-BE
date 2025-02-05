import { sign } from "jsonwebtoken";
import { BASE_URL_FE, JWT_SECRET_RESET_PASSWORD } from "../../config";
import { sendResetPasswordEmail } from "../../lib/handlebars/sendResetPasswordEmail";
import { prisma } from "../../lib/prisma";

export const forgotPasswordService = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        fullName: true,
        password: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.password) {
      throw new Error(
        "This account uses social login. Password reset is not available for social login accounts."
      );
    }

    await prisma.resetPasswordToken.updateMany({
      where: { userId: user.id, isValid: true },
      data: { isValid: false },
    });

    const token = sign({ id: user.id }, JWT_SECRET_RESET_PASSWORD!, {
      expiresIn: "15m",
    });

    await prisma.resetPasswordToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        isValid: true,
      },
    });

    const resetPasswordLink = `${BASE_URL_FE}/reset-password?token=${token}`;
    await sendResetPasswordEmail({
      email: user.email,
      name: user.fullName,
      resetPasswordLink,
    });

    return {
      message: "Reset password link have been sent to your email",
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to process password reset request");
  }
};
