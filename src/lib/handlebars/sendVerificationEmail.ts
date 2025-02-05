import handlebars from "handlebars";
import { transporter } from "../nodemailer";
import { emailVerificationTemplate } from "../../templates/EmailVerification";

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
    from: `Supajob <${process.env.GMAIL_EMAIL}>`,
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
