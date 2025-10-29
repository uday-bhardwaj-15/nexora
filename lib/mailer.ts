// lib/mailer.ts
import nodemailer from "nodemailer";

type MailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 465),
  secure: (process.env.SMTP_SECURE ?? "true") === "true", // true for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // your app password
  },
});

export async function sendMail(options: MailOptions) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error(
      "Missing SMTP configuration for Gmail (SMTP_USER/SMTP_PASS)."
    );
  }

  const info = await transporter.sendMail({
    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });

  return info;
}
