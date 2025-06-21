import Transport from "winston-transport";
import { Notifier } from "@airbrake/node";
import { LogEntry } from "winston";

export interface AirbrakeTransportOptions
  extends Transport.TransportStreamOptions {
  projectId: number;
  projectKey: string;
  environment?: string;
}

export class AirbrakeTransport extends Transport {
  private notifier: Notifier;

  constructor(opts: AirbrakeTransportOptions) {
    super(opts);
    this.notifier = new Notifier({
      projectId: opts.projectId,
      projectKey: opts.projectKey,
      environment: opts.environment ?? "production",
    });
  }

  // Winston will call this for every log entry
  log(info: LogEntry & { stack?: string }, callback: () => void): void {
    setImmediate(() => this.emit("logged", info)); // required boilerplate

    const { level, message, ...meta } = info;

    const err =
      info instanceof Error // user called logger.error(err)
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
        .catch((err: any) => console.error("Airbrake notify failed:", err));
    }

    callback();
  }

  private toSeverity(level: string): "error" | "warning" | "info" {
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