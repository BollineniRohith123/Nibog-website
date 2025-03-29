import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_PORT === '465',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      ...options
    });

    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}

export function generateRegistrationConfirmationEmail(params: {
  childName: string;
  eventName: string;
  gameName: string;
  registrationId: string;
}): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #FF6B6B;">Registration Confirmed!</h1>
      <p>Dear Parent,</p>
      <p>Your child <strong>${params.childName}</strong> has been successfully registered for:</p>
      <ul>
        <li><strong>Event:</strong> ${params.eventName}</li>
        <li><strong>Game:</strong> ${params.gameName}</li>
        <li><strong>Registration ID:</strong> ${params.registrationId}</li>
      </ul>
      <p>Please keep this registration ID for your records.</p>
    </div>
  `;
}
