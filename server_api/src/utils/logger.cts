import winston from "winston";

const logger: winston.Logger = winston.createLogger({
  level: process.env.WORKER_LOG_LEVEL || "debug",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

export = logger;
