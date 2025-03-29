import nodemailer from 'nodemailer';

// Email configuration interface
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

// Email template interface
interface EmailTemplate {
  subject: string;
  html: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Initialize nodemailer transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  // Send registration confirmation email
  async sendRegistrationConfirmation(params: {
    to: string;
    childName: string;
    eventName: string;
    gameName: string;
    registrationId: number;
  }): Promise<boolean> {
    try {
      const emailTemplate = this.createRegistrationConfirmationTemplate(params);

      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: params.to,
        subject: emailTemplate.subject,
        html: emailTemplate.html
      });

      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  // Create registration confirmation email template
  private createRegistrationConfirmationTemplate(params: {
    childName: string;
    eventName: string;
    gameName: string;
    registrationId: number;
  }): EmailTemplate {
    return {
      subject: `NIBOG Registration Confirmation for ${params.childName}`,
      html: `
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
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/registrations/${params.registrationId}" 
             style="display: inline-block; background-color: #4ECDC4; color: white; 
                    padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            View Registration Details
          </a>
          <p style="margin-top: 20px; color: #888;">
            If you have any questions, please contact our support team.
          </p>
        </div>
      `
    };
  }

  // Method to send custom email template
  async sendCustomEmail(params: {
    to: string;
    subject: string;
    templateId: string;
    templateData: Record<string, any>;
  }): Promise<boolean> {
    try {
      // Placeholder for custom email template logic
      // In a real-world scenario, this would integrate with a template management system
      const customTemplate = this.getCustomTemplate(params.templateId, params.templateData);

      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: params.to,
        subject: customTemplate.subject,
        html: customTemplate.html
      });

      return true;
    } catch (error) {
      console.error('Custom email sending failed:', error);
      return false;
    }
  }

  // Retrieve custom email template
  private getCustomTemplate(
    templateId: string, 
    data: Record<string, any>
  ): EmailTemplate {
    // Implement template retrieval and rendering logic
    // This is a placeholder implementation
    return {
      subject: `Custom Template: ${templateId}`,
      html: `<p>Custom template with data: ${JSON.stringify(data)}</p>`
    };
  }
}

export default new EmailService();
