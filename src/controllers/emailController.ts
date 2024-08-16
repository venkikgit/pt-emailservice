import { Request, Response } from 'express';
import { logger } from '../utils/logger.js';
import emailService from '../services/emailService.js';
import queueManagerService from '../services/queueManagerService.js';

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
            await emailService.sendEmailWithNodeMailer(
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
            res.status(500).json({
                DATA: null,
                MESSAGE: 'Error sending email',
                STATUS: 500,
            });
            return;
        }
    }
    async queueEmail(req: Request, res: Response): Promise<void> {
        const { to, subject, text } = req.body;
        try {
            const job = await queueManagerService.emailQueue.add(
                'email-queue',
                { to, subject, text },
                {
                    attempts: 3,
                    backoff: {
                        type: 'exponential',
                        delay: 1000,
                    },
                    removeOnComplete: {
                        age: 100,
                        count: 10,
                    },
                },
            );
            res.status(202).json({
                DATA: { to: to, subject: subject, text: text, jobId: job.id },
                MESSAGE: 'Email queued successfully',
                STATUS: 202,
            });
            return;
        } catch (err: Error | unknown) {
            logger.error(err);
            // return next(error);
            res.status(500).json({
                DATA: null,
                MESSAGE: 'Failed to queue email',
                STATUS: 500,
            });
            return;
        }
    }
    async getEmailStatus(req: Request, res: Response) {
        try {
            const job = await queueManagerService.emailQueue.getJob(
                req.params.jobId,
            );
            if (!job) {
                res.status(404).json({
                    DATA: null,
                    MESSAGE: 'Job Id not found',
                    STATUS: 404,
                });
                return;
            }

            const state = await job.getState();
            const attempts = job.attemptsMade;
            const result = job.returnvalue;
            const error = job.failedReason;
            res.status(200).json({
                DATA: { state, attempts, result, error },
                MESSAGE: 'Email status fetched successfully',
                STATUS: 200,
            });
        } catch (err: Error | unknown) {
            logger.error(err);
            // return next(error);
            res.status(500).json({
                DATA: null,
                MESSAGE: 'Failed to get email status',
                STATUS: 500,
            });
            return;
        }
    }
}

export default new EmailController();
