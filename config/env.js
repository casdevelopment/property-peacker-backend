import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const {
  PORT, NODE_ENV, SERVER_URL,
  DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD,
  JWT_SECRET, JWT_EXPIRES_IN,
  ARCJET_ENV, ARCJET_KEY,
  EMAIL_USER, EMAIL_PASSWORD,
  SMTP_HOST, SMTP_PORT,
} = process.env;