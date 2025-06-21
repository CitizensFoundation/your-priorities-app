// utils/loggerCore.ts          (one single implementation)
import winston from "winston";
import { AirbrakeTransport } from "./loggerAirbrakeTransportTs.js";

export function buildLogger() {
  const transports: winston.transport[] = [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ];

  if (process.env.AIRBRAKE_PROJECT_ID && process.env.AIRBRAKE_PROJECT_KEY) {
    transports.push(
      new AirbrakeTransport({
        level: "error",
        projectId: +process.env.AIRBRAKE_PROJECT_ID,
        projectKey: process.env.AIRBRAKE_PROJECT_KEY,
        environment: process.env.NODE_ENV,
      })
    );
  }

  return winston.createLogger({
    level: process.env.WINSTON_LOG_LEVEL ?? "debug",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    transports,
  });
}

