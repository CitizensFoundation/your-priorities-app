"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirbrakeTransport = void 0;
const winston_transport_1 = __importDefault(require("winston-transport"));
const node_1 = require("@airbrake/node");
class AirbrakeTransport extends winston_transport_1.default {
    constructor(opts) {
        super(opts);
        this.notifier = new node_1.Notifier({
            projectId: opts.projectId,
            projectKey: opts.projectKey,
            environment: opts.environment ?? "production",
        });
    }
    // Winston will call this for every log entry
    log(info, callback) {
        setImmediate(() => this.emit("logged", info)); // required boilerplate
        const { level, message, ...meta } = info;
        const err = info instanceof Error // user called logger.error(err)
            ? info
            : info.stack
                ? Object.assign(new Error(message), { stack: info.stack })
                : new Error(message);
        if (process.env.AIRBRAKE_PROJECT_ID) {
            this.notifier
                .notify({
                error: err,
                context: { severity: this.toSeverity(level) },
                params: meta,
            })
                .catch((err) => console.error("Airbrake notify failed:", err));
        }
        callback();
    }
    toSeverity(level) {
        switch (level) {
            case "error":
            case "crit":
            case "fatal":
                return "error";
            case "warn":
            case "warning":
                return "warning";
            default:
                return "info";
        }
    }
}
exports.AirbrakeTransport = AirbrakeTransport;
