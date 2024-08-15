import winston from 'winston';
import { Config } from './index.js';
export const logger = winston.createLogger({
    level: 'info',
    defaultMeta: {
        serviceName: 'EmailService',
    },
    transports: [
        new winston.transports.File({
            dirname: 'logs',
            filename: 'app.log',
            level: 'debug',
            silent: Config.NODE_ENV === 'test',
        }),
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
            silent: Config.NODE_ENV === 'test',
        }),
    ],
});
