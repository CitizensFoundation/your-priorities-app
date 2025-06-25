"use strict";
const redis = require("redis");
const log = require('../../utils/logger.cjs');
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
            pingInterval: 10000,
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
redisClient.on("error", (err) => log.error("Backend Redis client error", err));
redisClient.on("connect", () => log.info("Backend Redis client is connect"));
redisClient.on("reconnecting", () => log.info("Backend  Redis client is reconnecting"));
redisClient.on("ready", () => log.info("Backend Redis client is ready"));
redisClient.connect().catch(log.error);
module.exports = redisClient;
