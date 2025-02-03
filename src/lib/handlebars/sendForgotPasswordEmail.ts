import handlebars from "handlebars";
import { forgotPasswordTemplate } from "../../templates/ForgotPassword";
import { transporter } from "../nodemailer";

export const sendForgotPasswordEmail = async (data: {
  email: string;
  link: string;
}) => {
  const { email, link } = data;

  const template = handlebars.compile(forgotPasswordTemplate);

  const html = template({
    email,
    link,
  });

  const mailOptions = {
    from: `"Star Ticket" <${process.env.GMAIL_EMAIL}>`,
    to: email,
    subject: "Reset Your Password",
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    // console.log(`Forgot password email sent to ${email} successfully!`);
  } catch (error) {
    console.error("Error sending forgot password email:", error);
  }
};
