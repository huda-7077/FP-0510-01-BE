import handlebars from "handlebars";
import { transporter } from "../nodemailer";
import { interviewReminderTemplate } from "../../templates/InterviewReminder";

const sendInterviewReminderEmail = async (data: {
  email: string;
  position: string;
  company_name: string;
  applicant_name: string;
  company_logo?: string | undefined;
  scheduledDate: Date;
  interviewerName: string;
  location: string;
  meetingLink?: string | undefined;
  notes?: string | undefined;
}) => {
  handlebars.registerHelper("eq", function (this: object, a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
  });

  const template = handlebars.compile(interviewReminderTemplate);

  const { email, scheduledDate, ...templateData } = data;

  const wibDate = new Date(
    scheduledDate.toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
  );

  const longDateTimeWib = wibDate.toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });

  const html = template({
    email,
    scheduledDate: longDateTimeWib,
    ...templateData,
    company_logo:
      templateData.company_logo ??
      "https://res.cloudinary.com/dpeljv2vu/image/upload/v1738476920/23f5593d-2886-42d9-8059-bbdceb9b2774_g95csb.jpg",
    company_website: `https://google.com/`,
  });

  const mailOptions = {
    from: `"Supajob Company" <${process.env.GMAIL_EMAIL}>`,
    to: email,
    subject: `Job Interview Reminder: ${templateData.position} at ${templateData.company_name}`,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending assessment reminder email:", error);
  }
};

export default sendInterviewReminderEmail;
