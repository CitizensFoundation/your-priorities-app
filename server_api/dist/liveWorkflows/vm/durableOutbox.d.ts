/** Persist before send, delete only after the API has committed and acknowledged.
 * The API deduplicates keys; a lost HTTP response therefore cannot lose an event. */
export declare class DurableOutbox {
    private readonly root;
    private readonly send;
    private draining;
    private append;
    private lastStamp;
    constructor(root: string, send: (item: {
        type: string;
        data: unknown;
    }) => Promise<void>);
    enqueue(type: string, data: unknown, key: string): Promise<void>;
    drain(): Promise<void>;
}
