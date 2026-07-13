"use strict";
const { ipKeyGenerator } = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const DEFAULT_WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_MAX_REQUESTS = 30;
const positiveIntegerOrDefault = (value, fallback) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
};
const urlPreviewRateLimitKey = (req) => {
    const userId = req.user?.id;
    if (userId !== undefined && userId !== null) {
        return `user:${userId}`;
    }
    const address = req.ip || req.socket?.remoteAddress || "unknown";
    return `ip:${ipKeyGenerator(address)}`;
};
const sendRateLimitResponse = (_req, res) => {
    res.status(429).send({
        error: {
            code: "PREVIEW_RATE_LIMITED",
            message: "Too many URL preview requests.",
        },
    });
};
const createUrlPreviewRateLimitOptions = (redisClient, environment = process.env) => ({
    windowMs: positiveIntegerOrDefault(environment.URL_PREVIEW_RATE_LIMIT_WINDOW_MS, DEFAULT_WINDOW_MS),
    max: positiveIntegerOrDefault(environment.URL_PREVIEW_RATE_LIMIT_MAX, DEFAULT_MAX_REQUESTS),
    standardHeaders: true,
    legacyHeaders: false,
    passOnStoreError: true,
    keyGenerator: urlPreviewRateLimitKey,
    store: new RedisStore({
        prefix: "rate-limit:url-preview:",
        sendCommand: (...args) => redisClient.sendCommand(args),
    }),
    handler: sendRateLimitResponse,
});
module.exports = {
    DEFAULT_MAX_REQUESTS,
    DEFAULT_WINDOW_MS,
    createUrlPreviewRateLimitOptions,
    sendRateLimitResponse,
    urlPreviewRateLimitKey,
};
