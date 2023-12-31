"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
let redisClient;
if (process.env.REDIS_URL) {
    redisClient = (0, redis_1.createClient)({
        url: process.env.REDIS_URL,
        socket: {
            tls: true,
        },
    });
}
else {
    redisClient = (0, redis_1.createClient)({
        url: "redis://localhost:6379",
    });
}
class AnalyticsController {
    path = "/api/analytics";
    router = express_1.default.Router();
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
exports.AnalyticsController = AnalyticsController;
