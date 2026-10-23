export type VmCommandHandlerContext = {
    now(): Date;
};
export interface VmCommandHandler {
    readonly path: string;
    handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown>;
}
export declare class VmCommandDeduplicationError extends Error {
    constructor(message: string);
}
export type VmCommandRouterOptions = {
    maxCachedCommandResults?: number;
};
export declare class VmCommandRouter {
    private readonly handlers;
    private readonly commandResults;
    private readonly inFlightCommands;
    private readonly maxCachedCommandResults;
    constructor(handlers?: VmCommandHandler[], options?: VmCommandRouterOptions);
    register(handler: VmCommandHandler): void;
    has(path: string): boolean;
    dispatch(path: string, body: unknown, context: VmCommandHandlerContext): Promise<unknown | undefined>;
    private cacheCommandResult;
}
