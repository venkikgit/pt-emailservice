import { Queue, QueueOptions } from 'bullmq';
import Redis from 'ioredis';
import { Config } from '../utils/index.js';

const redisUrl = Config.REDIS_URL || 'redis://localhost:6379';
const redisConnection = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
});
const queueOptions: QueueOptions = {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 1,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
    },
};
// export const emailQueue = new Queue('email-queue', queueOptions);
class QueueManager {
    public emailQueue: Queue;
    // async emailQueue() {
    //     return new Queue('email-queue', queueOptions);
    // }
    constructor() {
        this.emailQueue = new Queue('email-queue', queueOptions);
    }
}

export default new QueueManager();
