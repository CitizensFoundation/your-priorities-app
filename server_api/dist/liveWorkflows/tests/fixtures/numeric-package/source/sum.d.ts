export declare function run(context: {
    artifact(name: string, content: string, type: string): Promise<void>;
    progress(processed: number, total: number, child?: string, failedRecords?: number, message?: string): Promise<void>;
}, input: {
    value: number;
}[]): Promise<{
    count: number;
    total: number;
}>;
