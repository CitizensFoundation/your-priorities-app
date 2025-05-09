declare const _exports: YpQueue;
export = _exports;
declare class YpQueue {
    get defaultQueueOptions(): {
        redis: {
            tls: {
                rejectUnauthorized: boolean;
            };
        } | undefined;
        defaultJobOptions: {
            attempts: number;
            removeOnComplete: boolean;
            removeOnFail: boolean;
        };
    };
    process(name: any, concurrency: any, processor: any): void;
    add(name: any, workPackage: any, priority: any, options: any): void;
    createQueues(): void;
    mainQueue: BullQueue.Queue<any> | undefined;
}
import BullQueue = require("bull");
