export const DEFAULT_MAX_REQUESTS: 30;
export const DEFAULT_WINDOW_MS: number;
export function createUrlPreviewRateLimitOptions(redisClient: any, environment?: NodeJS.ProcessEnv): {
    windowMs: any;
    max: any;
    standardHeaders: boolean;
    legacyHeaders: boolean;
    passOnStoreError: boolean;
    keyGenerator: (req: any) => string;
    store: RedisStore;
    handler: (_req: any, res: any) => void;
};
export function sendRateLimitResponse(_req: any, res: any): void;
export function urlPreviewRateLimitKey(req: any): string;
import { RedisStore } from "rate-limit-redis";
