import nodemailer from "nodemailer";
import { config } from "./EnvConfig";

interface MailOptions {
  email: string;
  subject: string;
  message: string;
}

const sendMail = async (options: MailOptions): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: config.smptHost,
    port: Number(config.smptPort),
    service: config.smptService,
    auth: {
      user: config.smptMail,
      pass: config.smptPassword,
    },
  });

  const mailOptions: nodemailer.SendMailOptions = {
    from: config.smptMail,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

export default sendMail;
