import dotenv from 'dotenv';
dotenv.config();

const { PORT, NODE_ENV, SMTP_SERVICE, SMTP_USER, SMTP_PASS } = process.env;

export const Config = {
    PORT,
    NODE_ENV,
    SMTP_SERVICE,
    SMTP_USER,
    SMTP_PASS,
};
