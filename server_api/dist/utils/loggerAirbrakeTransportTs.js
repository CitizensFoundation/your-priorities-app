import Transport from "winston-transport";
import { Notifier } from "@airbrake/node";
const IGNORED_ERRORS = (process.env.AIRBRAKE_IGNORED_ERRORS ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter((e) => e.length > 0);
export class AirbrakeTransport extends Transport {
    constructor(opts) {
        super(opts);
        this.notifier = new Notifier({
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
        const shouldNotify = process.env.AIRBRAKE_PROJECT_ID &&
            !IGNORED_ERRORS.some((p) => err.message.includes(p));
        if (shouldNotify) {
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
