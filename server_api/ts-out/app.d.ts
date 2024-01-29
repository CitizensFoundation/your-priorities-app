import express from "express";
import WebSocket, { WebSocketServer } from "ws";
interface YpRequest extends express.Request {
    ypDomain?: any;
    ypCommunity?: any;
    sso?: any;
    redisClient?: any;
    user?: any;
}
export declare class YourPrioritiesApi {
    app: express.Application;
    port: number;
    httpServer: any;
    ws: WebSocketServer;
    redisClient: any;
    wsClients: Map<string, WebSocket>;
    constructor(port?: number | undefined);
    addRedisToRequest(): void;
    forceHttps(): void;
    handleShortenedRedirects(): void;
    handleServiceWorkerRequests(): void;
    setupDomainAndCommunity(): void;
    initializeRateLimiting(): Promise<void>;
    setupSitemapRoute(): void;
    bearerCallback: () => void;
    checkAuthForSsoInit(): void;
    setupStaticFileServing(): void;
    initializeMiddlewares(): void;
    initializeEsControllers(): void;
    initializeRoutes(): void;
    initializePassportStrategies(): void;
    completeRegisterUserLogin: (user: any, loginType: string, req: any, done: () => void) => void;
    registerUserLogin: (user: any | null, userId: number, loginProvider: string, req: YpRequest, done: () => void) => void;
    setupErrorHandler(): void;
    listen(): void;
}
export {};
