/** Keep the disposable ledger alive until each already-started gateway operation
 * has recorded its settlement or unknown outcome. Closing an HTTP socket is not
 * evidence that its provider request has finished. */
export declare class ManualRequestDrain {
    private stopping;
    private readonly pending;
    wrap<Args extends unknown[], Result>(request: (...args: Args) => Promise<Result>): (...args: Args) => Promise<Result>;
    drain(timeoutMs?: number): Promise<void>;
}
