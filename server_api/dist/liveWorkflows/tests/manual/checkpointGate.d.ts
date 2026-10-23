import type { RequestHandler } from "express";
/** Manual-harness fault injection only. The runner persists __node_output before
 * this progress request. Holding its acknowledgement prevents the next paid stage. */
export declare class ManualCheckpointGate {
    private armed?;
    private response?;
    private reached;
    arm(runId: string, nodeId: string): void;
    readonly middleware: RequestHandler;
    atCheckpoint(runId: string, nodeId: string): boolean;
    release(): void;
}
