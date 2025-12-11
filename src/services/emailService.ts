// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: parseInt(process.env.SMTP_PORT || "465"), // Default to 465 if missing
//   secure: true, // True for 465, false for other ports
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASSWORD,
//   },
// });

// export const sendPasswordResetEmail = async (email: string, token: string) => {
//   const resetUrl = `http://localhost:3000/auth/reset-password?token=${token}`;
  
//   await transporter.sendMail({
//     from: process.env.SMTP_FROM,
//     to: email,
//     subject: "Reset your password",
//     html: `<p>Click <a href="${resetUrl}">here</a> to reset your password</p>`,
//   });
// };

import nodemailer, { Transporter } from "nodemailer";

// ---------------------------------------------------------
// 1. YOUR EXACT CONFIGURATION CODE
// ---------------------------------------------------------
function buildTransporter(): Transporter {
  if (!process.env.SMTP_HOST || !process.env.SMTP_PORT) {
    throw new Error("SMTP_HOST and SMTP_PORT must be configured");
  }

  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    throw new Error("SMTP_USER and SMTP_PASSWORD must be configured");
  }

  const isSecure = process.env.SMTP_SECURE === "true";
  const port = Number(process.env.SMTP_PORT);

  // Gmail SMTP configuration
  const transportOptions: any = {
    host: process.env.SMTP_HOST,
    port: port,
    secure: isSecure, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    // Connection timeout settings
    connectionTimeout: 10000, // 10 seconds to establish connection
    greetingTimeout: 10000, // 10 seconds for SMTP greeting
    socketTimeout: 30000, // 30 seconds for socket operations
    // For Gmail with port 587 (STARTTLS)
    requireTLS: !isSecure && port === 587,
    tls: {
      // Do not fail on invalid certificates (useful for some SMTP servers)
      rejectUnauthorized: false,
    },
  };

  return nodemailer.createTransport(transportOptions);
}

// ---------------------------------------------------------
// 2. INITIALIZE TRANSPORTER (Global Scope)
// ---------------------------------------------------------
// We call this once here so the connection pool is reused.
const transporter = buildTransporter();

// ---------------------------------------------------------
// 3. SEND EMAIL FUNCTION
// ---------------------------------------------------------
export const sendPasswordResetEmail = async (email: string, token: string) => {
  // Use production URL if available, otherwise localhost
  const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:4000";
  const resetUrl = `${domain}/auth/reset-password?token=${token}`;
  
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password</p>`,
  });
};