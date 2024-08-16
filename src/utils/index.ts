import dotenv from 'dotenv';
dotenv.config();

const {
    PORT,
    NODE_ENV,
    SMTP_SERVICE,
    SMTP_USER,
    SMTP_PASS,
    REDIS_URL,
    REDIS_PORT,
    aws_access_key_id,
    aws_secret_access_key,
    aws_ses_sender_email,
} = process.env;

export const Config = {
    PORT,
    NODE_ENV,
    SMTP_SERVICE,
    SMTP_USER,
    SMTP_PASS,
    REDIS_URL,
    REDIS_PORT,
    aws_access_key_id,
    aws_secret_access_key,
    aws_ses_sender_email,
};
