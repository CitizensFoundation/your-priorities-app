import type { Context } from "../runner/run.js";
export type Agent = (context: Context, input: YpWorkflowJson) => Promise<YpWorkflowJson>;
export interface EvaluationReport {
    success: boolean;
    total: number;
    cases: {
        id: string;
        passed: boolean;
        issues: string[];
    }[];
}
export declare function loadAgent(name: string): Promise<Agent>;
export declare function loadEvaluator(): Promise<(dataset: unknown, outputs: Record<string, unknown>[]) => EvaluationReport>;
