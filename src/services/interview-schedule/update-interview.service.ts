import sendInterviewReminderEmail from "../../lib/handlebars/sendInterviewReminderEmail";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

interface UpdateInterviewBody {
  scheduledDate: Date;
  interviewerName: string;
  location: string;
  meetingLink?: string | null;
  notes?: string | null;
  isDeleted?: boolean;
}

export const updateInterviewService = async (
  body: UpdateInterviewBody,
  userId: number,
  id: number
) => {
  const { meetingLink } = body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        isDeleted: false,
      },
      include: {
        company: {
          where: {
            isDeleted: false,
          },
        },
      },
    });

    if (!user) {
      throw new Error("Authentication Failed");
    }

    if (!user.companyId) {
      throw new Error("Authorization Failed");
    }

    const existingInterview = await prisma.interview.findUnique({
      where: { id, jobApplication: { job: { companyId: user.companyId } } },
    });

    if (!existingInterview) {
      throw new ApiError("Interview not found or you don't have access", 404);
    }

    if (meetingLink === "") {
      body.meetingLink = null;
    }

    const updatedInterview = await prisma.interview.update({
      where: { id },
      data: {
        ...body,
      },
      include: {
        jobApplication: {
          include: {
            user: {
              select: {
                fullName: true,
                email: true,
                phoneNumber: true,
                profilePicture: true,
                currentAddress: true,
                dateOfBirth: true,
                regency: {
                  select: {
                    regency: true,
                  },
                },
                educationLevel: true,
                experience: true,
              },
            },
            job: {
              include: {
                company: {
                  select: {
                    name: true,
                    logo: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    sendInterviewReminderEmail({
      email: updatedInterview.jobApplication.user.email,
      position: updatedInterview.jobApplication.job.title,
      company_name: updatedInterview.jobApplication.job.company.name,
      applicant_name: updatedInterview.jobApplication.user.fullName,
      company_logo:
        updatedInterview.jobApplication.job.company.logo || undefined,
      scheduledDate: updatedInterview.scheduledDate,
      interviewerName: updatedInterview.interviewerName,
      location: updatedInterview.location,
      meetingLink: updatedInterview.meetingLink || undefined,
      notes: updatedInterview.notes || undefined,
    });

    return updatedInterview;
  } catch (error) {
    console.error(`Error in updateAssessment for id ${id}:`, error);
    throw new ApiError("Update interview failed", 400);
  }
};
