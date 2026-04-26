import nodemailer from "nodemailer";
import { createLogger } from "@/lib/logger";

const logger = createLogger({ module: "sendmail" });

interface EmailOptions {
  from: string | undefined;
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export default async function sendEmail(
  emailOptions: EmailOptions
): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    await transporter.sendMail(emailOptions);
    logger.info(
      {
        hasHtml: Boolean(emailOptions.html),
      },
      "Email sent"
    );
  } catch (error: any | Error) {
    logger.error(
      {
        err: error,
        hasHtml: Boolean(emailOptions.html),
      },
      "Email send failed"
    );
  }
}
