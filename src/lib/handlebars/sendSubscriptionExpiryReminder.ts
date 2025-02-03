import handlebars from "handlebars";
import { transporter } from "../nodemailer";
import { BASE_URL_FE } from "../../config";
import { subscriptionReminderTemplate } from "../../templates/SubscriptionReminder";

export const sendSubscriptionExpiryReminder = async (data: {
  email: string;
  name: string;
  plan: string;
  duration: string;
  expiredAt: string;
}) => {
  const { email, name, plan, duration, expiredAt } = data;

  const siteUrl = BASE_URL_FE;

  const template = handlebars.compile(subscriptionReminderTemplate);

  const html = template({
    email,
    name,
    plan,
    duration,
    expiredAt,
    subscriptionUrl: `${BASE_URL_FE}/subscriptions`,
    siteUrl,
  });

  const mailOptions = {
    from: `"SupaJob" <${process.env.GMAIL_EMAIL}>`,
    to: email,
    subject: "Subscription Expiry Reminder",
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    // console.log(`Transaction email sent to ${email} successfully!`);
  } catch (error) {
    console.error("Error sending transaction email:", error);
  }
};
