import handlebars from "handlebars";
import { transporter } from "../nodemailer";
import { assessmentReminderTemplate } from "../../templates/AssessmentReminder";

const sendAssessmentReminderEmail = async (data: {
  email: string;
  position: string;
  company_name: string;
  applicant_name: string;
  company_logo?: string | undefined;
  assessment_url: string;
}) => {
  const template = handlebars.compile(assessmentReminderTemplate);

  const { email, ...templateData } = data;

  const html = template({
    email,
    ...templateData,
    company_logo:
      templateData.company_logo ??
      "https://res.cloudinary.com/dpeljv2vu/image/upload/v1738476920/23f5593d-2886-42d9-8059-bbdceb9b2774_g95csb.jpg",
    company_website: `https://google.com/`,
    assessment_url: data.assessment_url,
  });

  const mailOptions = {
    from: `"Supajob Company" <${process.env.GMAIL_EMAIL}>`,
    to: email,
    subject: `Job Assessment Reminder: ${templateData.position} at ${templateData.company_name}`,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending assessment reminder email:", error);
  }
};

export default sendAssessmentReminderEmail;
