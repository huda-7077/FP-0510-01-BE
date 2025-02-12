import { PaymentStatus, SubscriptionStatus } from "@prisma/client";
import { format } from "date-fns";
import * as schedule from "node-schedule";
import { sendSubscriptionExpiryReminder } from "./handlebars/sendSubscriptionExpiryReminder";
import { prisma } from "./prisma";

async function updateExpiredPayments() {
  try {
    const now = new Date();

    const { count } = await prisma.payment.updateMany({
      where: {
        expiredAt: { lte: now },
        status: { not: PaymentStatus.EXPIRED },
      },
      data: { status: PaymentStatus.EXPIRED },
    });

    console.log(`Updated ${count} payments to EXPIRED`);
  } catch (error) {
    console.error("Error updating expired payments:", error);
  }
}

async function updateSubscriptions() {
  try {
    const now = new Date();
    const tomorrow = new Date(now.getDate() - 1);
    // right now for testing
    // const rightNow = new Date(now.getTime());

    const { count } = await prisma.subscription.updateMany({
      where: {
        expiredDate: { lte: now },
        status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.MAILED] },
      },
      data: { status: SubscriptionStatus.EXPIRED },
    });

    const { count: renewedCount } = await prisma.subscription.updateMany({
      where: {
        expiredDate: { lte: tomorrow },
        status: SubscriptionStatus.RENEWED,
      },
      data: { status: SubscriptionStatus.EXPIRED },
    });

    console.log(`Updated ${renewedCount} RENEWED subscriptions to EXPIRED`);

    console.log(`Updated ${count} subscriptions to EXPIRED`);
  } catch (error) {
    console.error("Error updating subscriptions:", error);
  }
}

async function sendNotificationSubscription() {
  try {
    const now = new Date();
    // 5 minutes from now for testing
    // const minutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

    const tomorrow = new Date(now.getDate() + 1);

    const expiringSubscriptions = await prisma.subscription.findMany({
      where: {
        status: SubscriptionStatus.ACTIVE,
        expiredDate: { lte: tomorrow },
      },
      include: {
        user: { select: { email: true, fullName: true } },
        payment: {
          select: {
            category: { select: { name: true } },
            duration: true,
          },
        },
      },
    });

    for (const subscription of expiringSubscriptions) {
      const { category, duration } = subscription.payment;
      const { user } = subscription;
      const expiredAt = format(subscription.expiredDate, "dd MMM yyyy");

      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: SubscriptionStatus.MAILED },
      });

      await sendSubscriptionExpiryReminder({
        email: user.email,
        name: user.fullName,
        plan: category.name,
        duration: `${duration} ${duration === 1 ? "month" : "months"}`,
        expiredAt,
      });

      // console.log(
      //   `Subscription expiry reminder sent to ${user.email} successfully!`
      // );
    }
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
}

async function updateUserAssessmentStatus() {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now);
    oneDayAgo.setDate(now.getDate() - 1);

    const result = await prisma.$transaction(async (prisma) => {
      const updateUserAssessment = await prisma.userAssessment.updateMany({
        where: {
          createdAt: { lte: oneDayAgo },
          status: { notIn: ["EXPIRED", "DONE"] },
        },
        data: {
          status: "EXPIRED",
        },
      });

      const updateJobApplications = await prisma.jobApplication.updateMany({
        where: {
          status: {
            equals: "IN_REVIEW",
          },
        },
        data: {
          status: "REJECTED",
        },
      });

      return {
        userAssessmentCount: updateUserAssessment.count,
        jobApplicationCount: updateJobApplications.count,
      };
    });

    console.log(
      `Updated ${result.userAssessmentCount} user assessments to EXPIRED`
    );
    console.log(
      `Updated ${result.jobApplicationCount} job applications to REJECTED`
    );
  } catch (error) {
    console.error("Error updating expired payments:", error);
  }
}

async function scheduleJobsBasedOnCreatedAt() {
  try {
    const assessments = await prisma.userAssessment.findMany({
      where: { status: { notIn: ["EXPIRED", "DONE"] } },
    });

    assessments.forEach((assessment) => {
      const createdAt = new Date(assessment.createdAt);

      const cronExpression = `${createdAt.getMinutes()} ${createdAt.getHours()} * * *`;

      schedule.scheduleJob(cronExpression, async () => {
        console.log(
          `Running scheduled job to update expired user assessment for assessment ID: ${assessment.id}`
        );
        await updateUserAssessmentStatus();
      });
    });
  } catch (error) {
    console.error("Error scheduling jobs:", error);
  }
}

async function updateJobApplicationStatus() {
  try {
    const now = new Date();
    const threeDaysAgo = new Date(now);
    threeDaysAgo.setDate(now.getDate() - 3);

    const result = await prisma.$transaction(async (prisma) => {
      const updateJobApplications = await prisma.jobApplication.updateMany({
        where: {
          updatedAt: { lte: threeDaysAgo },
          status: {
            in: ["IN_REVIEW", "PENDING", "INTERVIEW_SCHEDULED"],
          },
        },
        data: {
          status: "REJECTED",
        },
      });

      return {
        jobApplicationCount: updateJobApplications.count,
      };
    });

    console.log(
      `Updated ${result.jobApplicationCount} job applications to REJECTED`
    );
  } catch (error) {
    console.error("Error updating expired payments:", error);
  }
}

async function deleteJobPermanently() {
  try {
    await prisma.$transaction(async (tx) => {
      const jobsWithAssessment = await tx.job.findMany({
        where: { requiresAssessment: true, isDeleted: true },
        select: { id: true },
      });

      for (const { id: jobId } of jobsWithAssessment) {
        const assessment = await tx.assessment.findUnique({
          where: { jobId },
          select: { id: true },
        });

        if (assessment) {
          const questionsId = await tx.assessmentQuestion.findMany({
            where: { assessmentId: assessment.id },
            select: { id: true },
          });

          for (const { id: questionId } of questionsId) {
            await tx.assessmentOption.deleteMany({
              where: { questionId },
            });
          }

          await tx.assessmentQuestion.deleteMany({
            where: { assessmentId: assessment.id },
          });

          await tx.assessment.delete({
            where: { id: assessment.id },
          });
        }

        await prisma.jobApplication.deleteMany({
          where: { jobId },
        });
      }

      const { count } = await prisma.job.deleteMany({
        where: { requiresAssessment: true, isDeleted: true },
      });

      console.log(
        `Deleted ${count} jobs with assessment and its relation permanently.`
      );
    });

    await prisma.$transaction(async (tx) => {
      const jobsWithoutAssessmentId = await tx.job.findMany({
        where: { requiresAssessment: false, isDeleted: true },
        select: { id: true },
      });

      for (const { id: jobId } of jobsWithoutAssessmentId) {
        await prisma.jobApplication.deleteMany({
          where: { jobId },
        });
      }

      const { count } = await prisma.job.deleteMany({
        where: { requiresAssessment: false, isDeleted: true },
      });

      console.log(`Deleted ${count} jobs with no assessment permanently.`);
    });

    console.log("All operations completed successfully.");
  } catch (error) {
    console.error("Error during permanent job deletion:", error);
  }
}

// Schedule the job to run every minute for testing purposes
// schedule.scheduleJob("* * * * *", async () => {
//   await sendNotificationSubscription();
//   await updateExpiredPayments();
//   await updateSubscriptions();
// });

schedule.scheduleJob("*/5 * * * *", async () => {
  console.log("Running scheduled job to update expired payments...");
  await updateExpiredPayments();
});

schedule.scheduleJob("0 0 * * *", async () => {
  console.log("Running scheduled job to send notifications...");
  await sendNotificationSubscription();
});

schedule.scheduleJob("0 0 * * *", async () => {
  console.log("Running scheduled job to update expired subscriptions...");
  await updateSubscriptions();
});

schedule.scheduleJob("0 0 * * *", async () => {
  await updateJobApplicationStatus();
});

schedule.scheduleJob("0 0 1 * *", async () => {
  await deleteJobPermanently();
});

scheduleJobsBasedOnCreatedAt();

console.log("Scheduled job initialized.");
