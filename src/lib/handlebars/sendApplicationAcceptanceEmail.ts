import handlebars from "handlebars";
import { applicationAcceptanceTemplate } from "../../templates/ApplicationAcceptance";
import { transporter } from "../nodemailer";

const sendApplicationAcceptanceEmail = async (data: {
  email: string;
  position: string;
  company_name: string;
  applicant_name: string;
  company_logo?: string | undefined;
}) => {
  const template = handlebars.compile(applicationAcceptanceTemplate);

  const { email, ...templateData } = data;

  const html = template({
    email,
    ...templateData,
    company_logo:
      templateData.company_logo ??
      "https://res.cloudinary.com/dpeljv2vu/image/upload/v1738476920/23f5593d-2886-42d9-8059-bbdceb9b2774_g95csb.jpg",
    company_website: `https://google.com/`,
  });

  const mailOptions = {
    from: `"Supajob Company" <${process.env.GMAIL_EMAIL}>`,
    to: email,
    subject: `Job Application Status: ${templateData.position} at ${templateData.company_name}`,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending application rejection email:", error);
  }
};

export default sendApplicationAcceptanceEmail;
