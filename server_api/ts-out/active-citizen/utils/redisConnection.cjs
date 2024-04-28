"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis = require("redis");
let redisClient;
if (process.env.REDIS_URL) {
    let redisUrl = process.env.REDIS_URL;
    if (redisUrl.startsWith("redis://h:")) {
        redisUrl = redisUrl.replace("redis://h:", "redis://:");
    }
    if (redisUrl.includes("rediss://")) {
        redisClient = redis.createClient({
            legacyMode: false,
            url: redisUrl,
            socket: { tls: true, rejectUnauthorized: false },
        });
    }
    else {
        redisClient = redis.createClient({ legacyMode: true, url: redisUrl });
    }
}
else {
    redisClient = redis.createClient({ legacyMode: true });
}
redisClient.on('error', err => console.error('Backend Redis client error', err));
redisClient.on('connect', () => console.log('Backend Redis client is connect'));
redisClient.on('reconnecting', () => console.log('Backend  Redis client is reconnecting'));
redisClient.on('ready', () => console.log('Backend Redis client is ready'));
redisClient.connect().catch(console.error);
module.exports = redisClient;
