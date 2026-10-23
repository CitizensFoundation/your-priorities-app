export declare function stableRequestId(key: string): string;
export declare function socketRequest<T>(socketPath: string, route: string, data: unknown): Promise<T>;
