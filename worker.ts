/* eslint-disable no-console */
import queueManagerService from './src/services/queueManagerService.ts';
import { Worker } from 'bullmq';
import emailService from './src/services/emailService.ts';
import fs from 'fs';

const emailQueue = queueManagerService.emailQueue;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const worker = new Worker(
    'email-queue',
    async (job) => {
        const { to, subject, text } = job.data;
        console.log(job.opts.attempts);
        let attempts = job.opts.attempts || 0;
        // if (job.data.attempts) {
        //     attempts = job.data.attempts;
        // }
        try {
            await emailService.sendEmailWithNodeMailer(to, subject, text);
            if (job.id) {
                await queueManagerService.emailQueue.remove(job.id);
            }
            // throw new Error('Email send failed');
            fs.writeFileSync('email-success.log', JSON.stringify(job));
            console.info(
                `Email sent to ${to} with subject "${subject}" with ${job.id} using primary email service`,
            );
        } catch (err: Error | unknown) {
            console.error('Error sending email:', err);
            console.info('Job data:' + JSON.stringify(job.data));

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
                console.warn(
                    'Maximum retry attempts reached for job . Trying one more time using Secondary Email Service:',
                    job.id,
                );

                try {
                    await emailService.sendEmailWithSES(to, subject, text);
                    if (job.id) {
                        await queueManagerService.emailQueue.remove(job.id);
                    }
                    console.info(
                        `Email sent to ${to} with subject "${subject}" with ${job.id} using secondary email service`,
                    );
                } catch (error) {
                    console.error(
                        'Error Occured with Senodary Email Service Also' +
                            error,
                    );
                    fs.writeFileSync('email-failed.log', JSON.stringify(job));
                    if (job.id) {
                        await queueManagerService.emailQueue.remove(job.id);
                    }
                }
            }
        }
    },
    {
        connection: emailQueue.opts.connection,
        removeOnComplete: { age: 100, count: 1 },
    },
);

console.log('Email worker is running');
