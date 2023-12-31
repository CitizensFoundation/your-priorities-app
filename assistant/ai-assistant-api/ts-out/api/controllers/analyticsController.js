import express from "express";
import { createClient } from "redis";
let redisClient;
if (process.env.REDIS_URL) {
    redisClient = createClient({
        url: process.env.REDIS_URL,
        socket: {
            tls: true,
        },
    });
}
else {
    redisClient = createClient({
        url: "redis://localhost:6379",
    });
}
export class AnalyticsController {
    path = "/api/analytics";
    router = express.Router();
    constructor() {
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.post(this.path + "/createActivityFromApp", this.createActivityFromApp);
    }
    createActivityFromApp = async (req, res) => {
        res.sendStatus(200);
    };
}
