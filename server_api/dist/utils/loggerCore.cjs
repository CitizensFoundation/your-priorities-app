"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildLogger = buildLogger;
// utils/loggerCore.ts          (one single implementation)
const winston_1 = __importDefault(require("winston"));
const loggerAirbrakeTransport_cjs_1 = require("./loggerAirbrakeTransport.cjs");
function buildLogger() {
    const transports = [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple()),
        }),
    ];
    if (process.env.AIRBRAKE_PROJECT_ID && process.env.AIRBRAKE_PROJECT_KEY) {
        transports.push(new loggerAirbrakeTransport_cjs_1.AirbrakeTransport({
            level: "error",
            projectId: +process.env.AIRBRAKE_PROJECT_ID,
            projectKey: process.env.AIRBRAKE_PROJECT_KEY,
            environment: process.env.NODE_ENV,
        }));
    }
    return winston_1.default.createLogger({
        level: process.env.WINSTON_LOG_LEVEL ?? "debug",
        format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json()),
        transports,
    });
}
