import Redis from 'ioredis';
import { Config } from './index.js';
const redisUrl = Config.REDIS_URL || 'redis://localhost:6379';
const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
});

async function markAsUnsubscribed(email: string) {
    await redis.sadd('unsubscribed', email);
}

async function markAsBounced(email: string) {
    await redis.sadd('bounced', email);
}

async function markAsSpamReporter(email: string) {
    await redis.sadd('spam_reporters', email);
}

async function isUnsubscribed(email: string) {
    return await redis.sismember('unsubscribed', email);
}

async function isBounced(email: string) {
    return await redis.sismember('bounced', email);
}

async function isSpamReporter(email: string) {
    return await redis.sismember('spam_reporters', email);
}

export {
    markAsUnsubscribed,
    markAsBounced,
    markAsSpamReporter,
    isUnsubscribed,
    isBounced,
    isSpamReporter,
};
