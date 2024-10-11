require('dotenv').config();

import { readFileSync } from 'fs';
import handlebars from 'handlebars';
import nodemailer, {
  SendMailOptions,
  TransportOptions,
  Transporter
} from 'nodemailer';
import path from 'path';

interface EmailPayload {
  to: string;
  subject: string;
  text?: string;
  template?: string;
  data?: Record<string, unknown>;
}

interface CustomTransportOptions extends TransportOptions {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

const mailFrom = process.env.SMTP_FROM_MAIL || '';
const mailFromName = process.env.SMTP_SENDER_NAME || '';
const host = process.env.SMTP_HOST || '';
const port = +(process.env.SMTP_PORT || 3306);
const secure = Boolean(process.env.SMTP_SSL);
const user = process.env.SMTP_USERNAME || '';
const pass = process.env.SMTP_PASSWORD || '';

const senderAddress = `"${mailFromName}" <${mailFrom}>`;

const mailConfig: CustomTransportOptions = {
  host,
  port,
  secure,
  auth: {
    user,
    pass
  }
};

let transporter: Transporter | null = null;

try {
  transporter = nodemailer.createTransport(mailConfig);
} catch (error) {
  console.error('Error creating mail transporter:', error);
}

const readHTMLFile = (path: string): string => {
  try {
    return readFileSync(path, 'utf-8');
  } catch (err) {
    console.error('Error reading email template:', err);
    throw err;
  }
};

const sendEmail = async ({
  to,
  subject,
  text = '',
  template = '',
  data = {}
}: EmailPayload): Promise<void> => {
  if (!transporter) {
    console.error('Mail transporter is not initialized');
    return;
  }

  let htmlContent = '';

  if (template !== '') {
    const templatePath = path.resolve(
      __dirname,
      '..',
      'templates',
      `${template}.template.html`
    );
    const htmlTemplate = readHTMLFile(templatePath);
    const compiledTemplate = handlebars.compile(htmlTemplate);
    htmlContent = compiledTemplate({
      ...data,
      app_url: process.env.APP_URL,
      app_name: process.env.APP_NAME
    });
  }

  const mailOptions: SendMailOptions = {
    from: senderAddress,
    to,
    subject,
    text,
    html: htmlContent
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export { sendEmail };
