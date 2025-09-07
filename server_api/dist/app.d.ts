import express from "express";
import type { Server as HttpServer } from "http";
import WebSocket, { WebSocketServer } from "ws";
import { RedisClientType } from "@redis/client";
import { WebSocketsManager } from "./webSockets.js";
interface YpRequest extends express.Request {
    ypDomain?: any;
    ypCommunity?: any;
    sso?: any;
    redisClient?: any;
    user?: any;
    clientAppPath?: string;
    adminAppPath?: string;
    dirName?: string;
    useNewVersion?: boolean;
}
export declare class YourPrioritiesApi {
    app: express.Application;
    port: number;
    httpServer: any;
    ws: WebSocketServer;
    redisClient: RedisClientType;
    wsClients: Map<string, WebSocket>;
    webSocketsManager: WebSocketsManager;
    constructor(port?: number | undefined);
    initialize(): Promise<void>;
    setupNewWebAppVersionHandling(): void;
    initializeRedis(): Promise<void>;
    addRedisToRequest(): void;
    addDirnameToRequest(): void;
    addInviteAsAnonMiddleWare(): void;
    forceHttps(): void;
    determineVersion: (req: YpRequest) => boolean;
    handleShortenedRedirects(): void;
    handleServiceWorker(req: YpRequest, res: express.Response): void;
    setupDomainAndCommunity(): void;
    initializeRateLimiting(): Promise<void>;
    setupSitemapRoute(): void;
    bearerCallback: () => import("winston").Logger;
    checkAuthForSsoInit(): void;
    setupExpresLogger: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
    initializeMiddlewares(): void;
    initializeEsControllers(): Promise<void>;
    setupStaticFileServing(): void;
    initializeRoutes(): void;
    initializePassportStrategies(): void;
    completeRegisterUserLogin: (user: any, // Replace 'any' with the actual user type
    loginType: string, req: YpRequest, // Replace 'any' with 'YpRequest' if it's the correct type
    done: () => void) => void;
    registerUserLogin: (user: any | null, userId: number, loginProvider: string, req: YpRequest, done: () => void) => void;
    setupErrorHandler(): void;
    listen(): Promise<void>;
    setupHttpsServer(): Promise<HttpServer>;
}
export {};
