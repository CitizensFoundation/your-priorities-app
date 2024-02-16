import express from "express";
import WebSocket, { WebSocketServer } from "ws";
interface YpRequest extends express.Request {
    ypDomain?: any;
    ypCommunity?: any;
    sso?: any;
    redisClient?: any;
    user?: any;
    dirName?: string;
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
    addDirnameToRequest(): void;
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
    initializeEsControllers(): Promise<void>;
    initializeRoutes(): void;
    initializePassportStrategies(): void;
    completeRegisterUserLogin: (user: any, loginType: string, req: YpRequest, done: () => void) => void;
    registerUserLogin: (user: any | null, userId: number, loginProvider: string, req: YpRequest, done: () => void) => void;
    setupErrorHandler(): void;
    listen(): Promise<void>;
}
export {};
//# sourceMappingURL=app.d.ts.map
