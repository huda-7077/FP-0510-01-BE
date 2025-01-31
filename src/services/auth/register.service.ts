import { User } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { hashPassword } from "../../lib/argon";
import { sendVerificationToken } from "./verification.service";

export const registerService = async (body: User) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      throw new Error("Email already registered");
    }

    if (!body.password) {
      throw new Error("Password is required");
    }
    const hashedPassword = await hashPassword(body.password);

    switch (body.role) {
      case "USER": {
        const user = await prisma.user.create({
          data: {
            email: body.email,
            password: hashedPassword,
            role: "USER",
            isVerified: false,
            isDeleted: false,
            fullName: body.fullName,
          },
        });
        const { password: _, ...userWithoutPassword } = user;

        await sendVerificationToken(user.id, user.email, user.fullName);

        return {
          message:
            "Registration successful. Please check your email to verify your account.",
          user: userWithoutPassword,
        };
      }

      case "ADMIN": {
        const company = await prisma.company.create({
          data: {
            name: body.fullName,
            establishedYear: new Date().getFullYear(),
            isDeleted: false,
          },
        });

        const user = await prisma.user.create({
          data: {
            email: body.email,
            password: hashedPassword,
            role: "ADMIN",
            companyId: company.id,
            phoneNumber: body.phoneNumber,
            isVerified: false,
            isDeleted: false,
            fullName: `ADMIN_${company.name
              .toUpperCase()
              .replace(/\s+/g, "_")}`,
          },
        });

        const { password: _, ...userWithoutPassword } = user;

        await sendVerificationToken(user.id, user.email, user.fullName);

        return {
          message:
            "Company registration successful. Please check your email to verify your account.",
          user: userWithoutPassword,
          company,
        };
      }

      default:
        throw new Error("Invalid role specified");
    }
  } catch (error) {
    throw error;
  }
};
