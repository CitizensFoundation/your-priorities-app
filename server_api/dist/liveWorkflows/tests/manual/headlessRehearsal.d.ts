export declare function offlineWorkflowCli<T>(workspace: string, ...args: string[]): Promise<T>;
export declare function offlineOperator(adapt: boolean): (workspace: string) => Promise<string>;
