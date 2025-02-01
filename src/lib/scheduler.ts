import * as schedule from "node-schedule";
import { prisma } from "./prisma";
import { PaymentStatus, SubscriptionStatus } from "@prisma/client";

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

    const { count } = await prisma.subscription.updateMany({
      where: {
        expiredDate: { lte: now },
        status: { not: SubscriptionStatus.INACTIVE },
      },
      data: { status: SubscriptionStatus.INACTIVE },
    });

    console.log(`Updated ${count} subscriptions to INACTIVE`);
  } catch (error) {
    console.error("Error updating subscriptions:", error);
  }
}

async function sendNotifications() {
  try {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const expiringSubscriptions = await prisma.subscription.findMany({
      where: {
        status: SubscriptionStatus.ACTIVE,
        expiredDate: { lte: yesterday },
      },
      include: {
        payment: {
          select: { user: { select: { email: true, fullName: true } } },
        },
      },
    });

    for (const subscription of expiringSubscriptions) {
      const userEmail = subscription.payment.user.email;

      // Email content
      const mailOptions = {
        from: "your-email@gmail.com", // Sender address
        to: userEmail, // Recipient address
        subject: "Your Subscription is About to Expire", // Email subject
        text: `Hello ${subscription.payment.user.fullName},\n\nYour subscription is about to expire. Please renew it to continue enjoying our services.\n\nBest regards,\nYour Company`, // Email body
      };

      // Send the email
      //   await transporter.sendMail(mailOptions);
      //   console.log(`Notification email sent to ${userEmail}`);
    }
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
}

// Schedule the job to run every minute
const job = schedule.scheduleJob("* * * * *", async () => {
  console.log("Running scheduled job to update expired payments...");
  await updateExpiredPayments();
});

console.log("Scheduled job initialized.");
