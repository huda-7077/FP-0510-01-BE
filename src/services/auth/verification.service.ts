import { sign } from "jsonwebtoken";
import { BASE_URL_FE, JWT_SECRET_VERIFY_EMAIL } from "../../config";
import { sendVerificationEmail } from "../../lib/handlebars";
import { prisma } from "../../lib/prisma";

export const sendVerificationToken = async (
  userId: number,
  email: string,
  name: string
) => {
  try {
    await prisma.verificationToken.updateMany({
      where: { userId, isValid: true },
      data: { isValid: false },
    });

    const token = sign({ userId }, JWT_SECRET_VERIFY_EMAIL!, {
      expiresIn: "2h",
    });

    await prisma.verificationToken.create({
      data: {
        userId,
        token,
        expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
        isValid: true,
      },
    });

    const verificationLink = `${BASE_URL_FE}/verify-email?token=${token}`;

    await sendVerificationEmail({
      email,
      name,
      verificationLink,
    });

    return token;
  } catch (error) {
    throw error;
  }
};

export const verifyEmailService = async (userId: number) => {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });

    const { password: _, ...userWithoutPassword } = user;

    return {
      message: "Email verified successfully",
      user: userWithoutPassword,
    };
  } catch (error) {
    throw error;
  }
};
