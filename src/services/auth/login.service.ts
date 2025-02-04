import { prisma } from "../../lib/prisma";
import { comparePassword } from "../../lib/argon";
import { sign } from "jsonwebtoken";
import { JWT_SECRET } from "../../config";

export const loginService = async (email: string, password: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (!user.password) {
      throw new Error("Please login with Google");
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const { password: _, ...userWithoutPassword } = user;

    const token = sign(
      {
        id: user.id,
        isVerified: user.isVerified,
        role: user.role,
      },
      JWT_SECRET!,
      { expiresIn: "2h" }
    );

    return {
      message: "Login successful",
      token,
      ...userWithoutPassword,
      verificationMessage: !user.isVerified
        ? "Please verify your email to access all features"
        : null,
    };
  } catch (error) {
    throw error;
  }
};