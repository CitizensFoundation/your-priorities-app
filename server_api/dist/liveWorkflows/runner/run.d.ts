export { orderedAgents } from "../graph.js";
export interface Context {
    nodeId: string;
    mode: "trial" | "bulk";
    configuration: Record<string, YpWorkflowJson>;
    model(key: string, system: string, input: YpWorkflowJson, role?: string): Promise<YpWorkflowJson>;
    connector(key: string, binding: string, operation: string, input: Record<string, YpWorkflowJson>): Promise<YpWorkflowJson>;
    progress(processed: number, total: number, child?: string, failedRecords?: number, message?: string): Promise<void>;
    checkpoint(key: string, value: YpWorkflowJson): Promise<void>;
    restore(key: string): Promise<YpWorkflowJson | undefined>;
    artifact(name: string, content: string, contentType: string): Promise<void>;
    withRecord?<T>(id: string, work: () => Promise<T>): Promise<T>;
    cancelled(): Promise<boolean>;
}
export declare function runPackage(options: {
    root: string;
    output: string;
    socket: string;
    run: YpWorkflowRun;
    inputs: YpWorkflowJson[];
    reusedOutputs?: Record<string, YpWorkflowJson>;
    request?: <T>(route: string, data: unknown) => Promise<T>;
}): Promise<void>;
