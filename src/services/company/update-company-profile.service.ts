import { cloudinaryRemove, cloudinaryUpload } from "../../lib/cloudinary";
import { prisma } from "../../lib/prisma";

interface UpdateCompanyProfileProps {
  name: string;
  description?: string;
  industry?: string;
  employeeCount?: string;
  establishedYear?: string;
  links?: string;
  about?: string;
  phoneNumber?: string;
}

export const updateCompanyProfileService = async (
  userId: number,
  body: UpdateCompanyProfileProps,
  files?: {
    logo?: Express.Multer.File[];
  }
) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId, isDeleted: false },
      include: {
        company: {
          where: {
            isDeleted: false,
          },
        },
      },
    });

    if (!user || !user.company) {
      throw new Error("Company not found");
    }

    let logoUrl: string | undefined;
    if (files?.logo?.[0]) {
      if (user.company.logo) {
        await cloudinaryRemove(user.company.logo);
      }
      const uploadResult = await cloudinaryUpload(files.logo[0], {
        folder: "company-logos",
      });
      logoUrl = uploadResult.secure_url;
    }

    await prisma.company.update({
      where: { id: user.company.id },
      data: {
        name: body.name,
        description: body.description,
        industry: body.industry,
        employeeCount: body.employeeCount
          ? parseInt(body.employeeCount)
          : undefined,
        establishedYear: body.establishedYear
          ? parseInt(body.establishedYear)
          : undefined,
        links: body.links,
        about: body.about,
        ...(logoUrl && { logo: logoUrl }),
      },
    });

    if (body.phoneNumber) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          phoneNumber: body.phoneNumber,
        },
      });
    }

    return { message: "Company profile updated successfully" };
  } catch (error) {
    throw error;
  }
};
