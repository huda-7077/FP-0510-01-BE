import handlebars from "handlebars";
import { transactionPaidTemplate } from "../../templates/TransactionPaid";
import { transporter } from "../nodemailer";
import { BASE_URL_FE } from "../../config";

export const sendTransactionPaidEmail = async (data: {
  paymentId: string;
  email: string;
  name: string;
  transactionStatus: string;
  plan: string;
  duration: string;
  total: string;
  paymentMethod: string;
  invoiceUrl: string;
}) => {
  const {
    email,
    name,
    transactionStatus,
    plan,
    duration,
    paymentMethod,
    total,
    paymentId,
    invoiceUrl,
  } = data;

  const siteUrl = BASE_URL_FE;

  const template = handlebars.compile(transactionPaidTemplate);

  const html = template({
    paymentId,
    email,
    name,
    transactionStatus,
    plan,
    duration,
    paymentMethod,
    total,
    invoiceUrl,
    siteUrl,
  });

  const mailOptions = {
    from: `"Supajob" <${process.env.GMAIL_EMAIL}>`,
    to: email,
    subject: `Transaction ${transactionStatus}`,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    // console.log(`Transaction email sent to ${email} successfully!`);
  } catch (error) {
    console.error("Error sending transaction email:", error);
  }
};
