import handlebars from "handlebars";
import { forgotPasswordTemplate } from "../../templates/ForgotPassword";
import { transporter } from "../nodemailer";

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
