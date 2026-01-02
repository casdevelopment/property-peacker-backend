import nodemailer from 'nodemailer';

import { EMAIL_USER, EMAIL_PASSWORD, SMTP_HOST, SMTP_PORT } from './env.js'

const transporter = nodemailer.createTransport({
  host: SMTP_HOST || 'smtp.mailtrap.io',
  port: Number(SMTP_PORT) || 2525,
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  }
})

export default transporter;