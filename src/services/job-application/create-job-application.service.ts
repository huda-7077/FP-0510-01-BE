import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";
import { cloudinaryUpload } from "../../lib/cloudinary";
import { ApplicationStatus } from "@prisma/client";

interface CreateJobApplicationBody {
  jobId: number;
  expectedSalary: number;
  useExistingCV?: string;
}

const checkUserEligibility = (user: any) => {
  if (!user.isVerified) {
    throw new ApiError(
      "Only verified users can apply for jobs. Please verify your email first.",
      403
    );
  }

  const requiredFields = [
    "email",
    "fullName",
    "currentAddress",
    "phoneNumber",
    "dateOfBirth",
    "gender",
    "educationLevel",
  ];

  const missingFields = requiredFields.filter((field) => !user[field]);

  if (missingFields.length > 0) {
    throw new ApiError(
      `Please complete your profile first. Missing fields: ${missingFields.join(
        ", "
      )}`,
      400
    );
  }
};

export const createJobApplicationService = async (
  userId: number,
  body: CreateJobApplicationBody,
  files?: {
    cvFile?: Express.Multer.File[];
    attachment?: Express.Multer.File[];
  }
) => {
  try {
    const { expectedSalary } = body;
    const jobId = Number(body.jobId);
    const useExistingCV = body.useExistingCV === "true";

    // Get user and check profile completeness
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    checkUserEligibility(user);

    // Check if job exists and is still open
    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        isDeleted: false,
        isPublished: true,
        applicationDeadline: {
          gt: new Date(),
        },
      },
    });

    if (!job) {
      throw new ApiError(
        "Job not found or no longer accepting applications",
        404
      );
    }

    // Check if user already applied
    const existingApplication = await prisma.jobApplication.findFirst({
      where: {
        jobId,
        userId,
      },
    });

    if (existingApplication) {
      throw new ApiError("You have already applied for this job", 409);
    }

    // Handle CV file
    let cvFileUrl: string;

    if (useExistingCV === true) {
      if (!user.cvUrl) {
        throw new ApiError("No existing CV found in your profile", 400);
      }
      cvFileUrl = user.cvUrl;
    } else {
      if (!files?.cvFile?.[0]) {
        throw new ApiError("CV file is required", 400);
      }
      const cvUploadResult = await cloudinaryUpload(files.cvFile[0], {
        folder: "cv_files",
        resource_type: "raw",
      });
      cvFileUrl = cvUploadResult.secure_url;
    }

    // Handle optional attachment
    let attachmentUrl: string | undefined;
    if (files?.attachment?.[0]) {
      const attachmentUploadResult = await cloudinaryUpload(
        files.attachment[0],
        {
          folder: "job_attachments",
          resource_type: "auto",
        }
      );
      attachmentUrl = attachmentUploadResult.secure_url;
    }

    // Create job application
    const jobApplication = await prisma.jobApplication.create({
      data: {
        jobId,
        userId,
        cvFile: cvFileUrl,
        attachment: attachmentUrl,
        expectedSalary: Number(expectedSalary),
        status: ApplicationStatus.PENDING,
      },
      include: {
        job: {
          include: {
            company: true,
          },
        },
      },
    });

    return {
      jobApplication,
      message: "Job application submitted successfully",
    };
  } catch (error) {
    throw error;
  }
};
