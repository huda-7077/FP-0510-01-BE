import axios from "axios";
import { sign } from "jsonwebtoken";
import { JWT_SECRET } from "../../config";
import { prisma } from "../../lib/prisma";

export const googleLoginService = async (token: string) => {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const payload = response.data;
    if (!payload.email) throw new Error("Invalid Google token");

    let user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: payload.email,
          fullName: payload.name,
          profilePicture: payload.picture,
          role: "USER",
          isVerified: true,
          isDeleted: false,
        },
      });
    }

    const { password: _, ...userWithoutPassword } = user;

    const jwtToken = sign(
      { userId: user.id, isVerified: user.isVerified, role: user.role },
      JWT_SECRET!,
      {
        expiresIn: "2h",
      }
    );

    return {
      message: "Login successful",
      token: jwtToken,
      ...userWithoutPassword,
    };
  } catch (error) {
    throw error;
  }
};
