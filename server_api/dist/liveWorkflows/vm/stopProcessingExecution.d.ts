/** Docker --rm may remove the container before `stop`; the execution receipt must still finish. */
export declare function stopProcessingExecution(stop: () => Promise<unknown>, done: Promise<void>): Promise<void>;
