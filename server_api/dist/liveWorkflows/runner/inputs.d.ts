export declare function parseInput(file: string, name: string, source: string): Promise<Record<string, YpWorkflowJson>[]>;
export declare function stratifiedSample<T extends {
    text?: YpWorkflowJson;
}>(items: T[], count: number): T[];
