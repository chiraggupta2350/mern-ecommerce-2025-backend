import sgMail from '@sendgrid/mail';
import path from 'path';
import { dirname } from 'path';
import fs from 'fs';
import hbs from 'handlebars';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Utility function to send emails with dynamic data and templates
const sendEmail = async ({ to, subject, templateName, templateData }) => {
  try {
    // Load the template
    const templatePath = path.join(__dirname, '../templates', `${templateName}.hbs`);
    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    
    // Compile the template with handlebars
    const template = hbs.compile(templateSource);
    const html = template(templateData);

    // Send email
    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL, 
      subject,
      html,
    };

    await sgMail.send(msg);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

export default sendEmail;
