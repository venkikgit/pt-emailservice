import { Queue, QueueOptions } from 'bullmq';
import Redis from 'ioredis';
import { Config } from '../utils/index.js';

const redisUrl = Config.REDIS_URL || 'redis://localhost:6379';
const connection = new Redis(redisUrl);
const queueOptions: QueueOptions = {
    connection,
};

export const emailQueue = new Queue('email-queue', queueOptions);
