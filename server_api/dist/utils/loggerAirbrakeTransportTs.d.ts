import Transport from "winston-transport";
import { LogEntry } from "winston";
export interface AirbrakeTransportOptions extends Transport.TransportStreamOptions {
    projectId: number;
    projectKey: string;
    environment?: string;
}
export declare class AirbrakeTransport extends Transport {
    private notifier;
    constructor(opts: AirbrakeTransportOptions);
    log(info: LogEntry & {
        stack?: string;
    }, callback: () => void): void;
    private toSeverity;
}
