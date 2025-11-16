import nodemailer from 'nodemailer';

export const MAIL_USER = process.env.MAIL_USER;
export const MAIL_APP_PASSWORD = process.env.MAIL_APP_PASSWORD;
export const MAIL_FROM_NAME = process.env.MAIL_FROM_NAME || 'Entipedia';

const fallbackBaseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const APP_BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  fallbackBaseUrl;

export const createTransporter = () => {
  if (!MAIL_USER || !MAIL_APP_PASSWORD) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: MAIL_USER,
      pass: MAIL_APP_PASSWORD,
    },
  });
};
