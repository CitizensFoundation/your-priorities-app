declare const _exports: YpQueue;
export = _exports;
declare class YpQueue {
    processors: Map<any, any>;
    workers: Map<any, any>;
    queues: Map<any, any>;
    queuePrefix: string;
    get defaultJobOptions(): {
        attempts: number;
        removeOnComplete: boolean;
        removeOnFail: boolean;
    };
    wrapProcessor(processor: any): (job: any) => Promise<any>;
    process(name: any, concurrency: any, processor: any): void;
    add(name: any, workPackage: any, priority: any, options: any): void;
    getQueue(name: any): any;
    setupWorkerEvents(worker: any): void;
}
