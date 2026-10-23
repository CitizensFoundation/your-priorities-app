import type { WorkflowStore, WorkflowTransaction } from "../store.js";
export declare class MemoryWorkflowStore implements WorkflowStore {
    private states;
    private documents;
    private history;
    private locks;
    create(state: YpWorkflowState): Promise<void>;
    groups(): Promise<number[]>;
    transact<T>(groupId: number, work: (tx: WorkflowTransaction) => Promise<T>): Promise<T>;
    events(groupId: number, after: number, limit?: number): Promise<YpWorkflowEvent[]>;
}
export declare const hostId = "55555555-5555-4555-8555-555555555555";
export declare const runId = "33333333-3333-4333-8333-333333333333";
export declare function workspace(groupId?: number): YpWorkflowState;
export declare function run(state?: YpWorkflowState): YpWorkflowRun;
export declare function fixture(): Promise<{
    store: MemoryWorkflowStore;
    state: YpWorkflowState;
    run: YpWorkflowRun;
}>;
