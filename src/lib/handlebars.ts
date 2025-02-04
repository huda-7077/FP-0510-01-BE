import handlebars from "handlebars";
import { transporter } from "./nodemailer";
import { notificationTransactionTemplate } from "../templates/NotificationTransaction";
import { forgotPasswordTemplate } from "../templates/ForgotPassword";
import { emailVerificationTemplate } from "../templates/EmailVerification";

export const sendTransactionEmail = async (data: {
  email: string;
  name: string;
  transactionStatus: string;
  ticketQuantity: string;
  totalDiscount: string;
  totalPrice: string;
  total: string;
}) => {
  const {
    email,
    name,
    transactionStatus,
    totalDiscount,
    totalPrice,
    ticketQuantity,
    total,
  } = data;

  const template = handlebars.compile(notificationTransactionTemplate);

  const html = template({
    email,
    name,
    transactionStatus,
    ticketQuantity,
    totalDiscount,
    totalPrice,
    total,
  });

  const mailOptions = {
    from: `"Star Ticket" <${process.env.GMAIL_EMAIL}>`,
    to: email,
    subject: `Transaction ${transactionStatus}`,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending transaction email:", error);
  }
};

export const sendResetPasswordEmail = async (data: {
  email: string;
  name: string;
  resetPasswordLink: string;
}) => {
  const { email, name, resetPasswordLink } = data;

  const template = handlebars.compile(forgotPasswordTemplate);

  const html = template({
    email,
    name,
    resetPasswordLink,
  });

  const mailOptions = {
    from: `"SupaJob" <${process.env.GMAIL_EMAIL}>`,
    to: email,
    subject: "Password Reset Request",
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};

export const sendVerificationEmail = async (data: {
  email: string;
  name: string;
  verificationLink: string;
}) => {
  const { email, name, verificationLink } = data;

  const template = handlebars.compile(emailVerificationTemplate);

  const html = template({
    name,
    verificationLink,
  });

  const mailOptions = {
    from: `"SupaJob" <${process.env.GMAIL_EMAIL}>`,
    to: email,
    subject: "Verify Your Email Address",
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};
