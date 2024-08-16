import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { Config } from '../utils/index.js';
import AWS from 'aws-sdk';
import { logger } from '../utils/logger.js';
class EmailService {
    async sendEmailWithNodeMailer(
        to: string,
        subject: string,
        text: string,
    ): Promise<void> {
        return await sendMailWithNodeMailer({ to, subject, text });
    }
    async sendEmailWithSES(
        to: string,
        subject: string,
        text: string,
    ): Promise<void> {
        return sendEmailWithSES({ to, subject, text });
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

export const sendMailWithNodeMailer = async ({
    to,
    subject,
    text,
}: {
    to: string;
    subject: string;
    text: string;
}) => {
    try {
        await transporter.sendMail({
            from: Config.SMTP_USER,
            to,
            subject,
            text,
        });
        logger.info('Email sent from  transporter');
    } catch (error) {
        logger.error('Error sending email' + error);
        throw new Error('Failed to send email with NodeMailer');
    }
};

AWS.config.update({
    region: 'ap-south-1',
    accessKeyId: Config.aws_access_key_id,
    secretAccessKey: Config.aws_secret_access_key,
});
const ses = new AWS.SES();

const sendEmailWithSES = async ({
    to,
    subject,
    text,
}: {
    to: string;
    subject: string;
    text: string;
}) => {
    const senderEmail = Config.aws_ses_sender_email || 'hello@venki.me';
    const params: AWS.SES.SendEmailRequest = {
        Destination: {
            ToAddresses: [to],
        },
        Message: {
            Body: {
                Text: {
                    Charset: 'UTF-8',
                    Data: text,
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: subject,
            },
        },
        Source: senderEmail,
    };
    try {
        logger.debug(ses);
        const result = await ses.sendEmail(params).promise();
        logger.info('Email sent:', result);
    } catch (error) {
        logger.error('Error sending email', error);
        throw new Error('Failed to send email with aws ses');
    }
};
