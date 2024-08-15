import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { Config } from '../utils/index.js';
class EmailService {
    async sendEmail(to: string, subject: string, text: string): Promise<void> {
        return await sendMail({ to, subject, text });
    }
}

export default new EmailService();

const transporter = nodemailer.createTransport({
    service: Config.SMTP_SERVICE,
    auth: {
        user: Config.SMTP_USER,
        pass: Config.SMTP_PASS,
    },
} as SMTPTransport.Options);

export const sendMail = async ({
    to,
    subject,
    text,
}: {
    to: string;
    subject: string;
    text: string;
}) => {
    await transporter.sendMail({
        from: Config.SMTP_USER,
        to,
        subject,
        text,
    });
};
