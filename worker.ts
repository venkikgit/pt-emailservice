import queueManagerService from './src/services/queueManagerService.ts';
import { Worker } from 'bullmq';
import emailService from './src/services/emailService.ts';
import { logger } from './src/utils/logger.ts';

const emailQueue = queueManagerService.emailQueue;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const worker = new Worker(
    'email-queue',
    async (job) => {
        const { to, subject, text } = job.data;
        logger.info(job.data);
        let attempts = job.data.attempts || 0;
        try {
            await emailService.sendEmail(to, subject, text);
            if (job.id) {
                await queueManagerService.emailQueue.remove(job.id);
            }
            // await job.remove();
            // throw new Error('Email send failed');

            logger.info(
                `Email sent to ${to} with subject "${subject}" with ${job.id}`,
            );
        } catch (err: Error | unknown) {
            logger.error('Error sending email:', err);
            logger.error('Job data:', job.data);

            if (attempts < 3) {
                attempts++;
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
// worker.on('completed', (job) => {
//     logger.info('Email sent successfully:' + job.id);
//     // You can access the number of attempts from job.data.attempts
// });

// worker.on('failed', (job, err) => {
//     logger.error('Email failed to send:' + err + job.data);
//     // You can access the number of attempts from job.data.attempts
// });

logger.info('Email worker is running');
