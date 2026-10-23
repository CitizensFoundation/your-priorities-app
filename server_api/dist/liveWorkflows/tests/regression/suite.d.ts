import { startManualHarness, type ManualHarness } from "../manual/harness.js";
import { type GroupCreationContinuation } from "../manual/groupCreationDriver.js";
declare function scenario(name: string, factory: (harness: ManualHarness, output: string, signal: AbortSignal) => GroupCreationContinuation, signal: AbortSignal, options?: Parameters<typeof startManualHarness>[2]): Promise<void>;
export declare function regressionCase(name: string, factory: Parameters<typeof scenario>[1], options?: Parameters<typeof startManualHarness>[2]): void;
export {};
