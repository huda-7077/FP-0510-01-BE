import { cloudinaryRemove, cloudinaryUpload } from "../../lib/cloudinary";
import { prisma } from "../../lib/prisma";

interface UpdateProfileProps {
  fullName: string;
  headline?: string;
  dateOfBirth?: string | Date;
  gender?: "MALE" | "FEMALE";
  educationLevel?: string;
  currentAddress?: string;
  phoneNumber?: string;
  skills?: string | string[];
  regencyId?: number;
}

export const updateProfileService = async (
  userId: number,
  data: UpdateProfileProps,
  files?: {
    profilePicture?: Express.Multer.File[];
    cvUrl?: Express.Multer.File[];
  }
) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId, isDeleted: false },
      include: {
        regency: {
          include: {
            province: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    let profilePictureUrl: string | undefined;
    if (files?.profilePicture?.[0]) {
      if (user.profilePicture) {
        await cloudinaryRemove(user.profilePicture);
      }
      const uploadResult = await cloudinaryUpload(files.profilePicture[0], {
        folder: "profile-pictures",
      });
      profilePictureUrl = uploadResult.secure_url;
    }

    let cvUrl: string | undefined;
    if (files?.cvUrl?.[0]) {
      if (user.cvUrl) {
        await cloudinaryRemove(user.cvUrl);
      }
      const uploadResult = await cloudinaryUpload(files.cvUrl[0], {
        folder: "cvs",
        resource_type: "raw",
      });
      cvUrl = uploadResult.secure_url;
    }

    let skillsArray: string[] | undefined;
    if (typeof data.skills === "string") {
      skillsArray = data.skills.split(",").map((skill: string) => skill.trim());
    } else if (Array.isArray(data.skills)) {
      skillsArray = data.skills;
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: data.fullName,
        headline: data.headline,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        gender: data.gender,
        educationLevel: data.educationLevel,
        currentAddress: data.currentAddress,
        phoneNumber: data.phoneNumber,
        skills: skillsArray,
        regencyId: data.regencyId
          ? parseInt(data.regencyId.toString())
          : undefined,
        ...(profilePictureUrl && { profilePicture: profilePictureUrl }),
        ...(cvUrl && { cvUrl: cvUrl }),
      },
      include: {
        regency: {
          include: {
            province: true,
          },
        },
      },
    });

    return { message: "Profile updated successfully" };
  } catch (error) {
    throw error;
  }
};
