import queueManagerService from './src/services/queueManagerService.ts';
import { Worker } from 'bullmq';
import emailService from './src/services/emailService.ts';
import { logger } from './src/utils/logger.ts';
import fs from 'fs';

const emailQueue = queueManagerService.emailQueue;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const worker = new Worker(
    'email-queue',
    async (job) => {
        const { to, subject, text } = job.data;
        logger.debug(job.opts.attempts);
        let attempts = job.opts.attempts || 0;
        // if (job.data.attempts) {
        //     attempts = job.data.attempts;
        // }
        try {
            await emailService.sendEmail(to, subject, text);
            if (job.id) {
                await queueManagerService.emailQueue.remove(job.id);
            }
            // throw new Error('Email send failed');

            logger.info(
                `Email sent to ${to} with subject "${subject}" with ${job.id}`,
            );
        } catch (err: Error | unknown) {
            logger.error('Error sending email:', err);
            logger.info('Job data:' + JSON.stringify(job.data));

            if (attempts < 3) {
                attempts++;
                // job.data.attempts++;
                await queueManagerService.emailQueue.add(
                    'email-queue',
                    { to, subject, text },
                    {
                        attempts: 1,
                        backoff: {
                            type: 'exponential',
                            delay: 1000,
                        },
                    },
                );
            } else {
                logger.warn('Maximum retry attempts reached for job:', job.id);
                fs.writeFileSync('email-failed.log', JSON.stringify(job));
                if (job.id) {
                    await queueManagerService.emailQueue.remove(job.id);
                }
            }
        }
    },
    {
        connection: emailQueue.opts.connection,
        removeOnComplete: { age: 100, count: 1 },
    },
);

logger.info('Email worker is running');
