import { Request, Response } from 'express';
import { logger } from '../utils/logger.js';
import emailService from '../services/emailService.js';

class EmailController {
    async sendEmail(req: Request, res: Response) {
        try {
            if (!req.body.to && !req.body.subject && !req.body.text) {
                res.status(400).json({
                    DATA: null,
                    MESSAGE: 'to,subject and text are required',
                    STATUS: 400,
                });
                return;
            }
            await emailService.sendEmail(
                req.body.to,
                req.body.subject,
                req.body.text,
            );
            res.status(200).json({
                DATA: null,
                MESSAGE: 'Email sent successfully',
                STATUS: 200,
            });
            return;
        } catch (error: Error | unknown) {
            logger.error(error);
            // return next(error);
            res.status(200).json({
                DATA: null,
                MESSAGE: 'Error sending email',
                STATUS: 500,
            });
            return;
        }
    }
}

export default new EmailController();
