export declare const codexOperations: readonly ["status", "data", "validate", "trial", "connections", "groups", "propose-connection", "check-connection", "import-connection"];
export declare const cliUsage = "Usage: yp-workflow status|data [asset-id ...]|validate|connections\n  groups [--search text]\n  propose-connection <public-proposal.json>\n  check-connection|import-connection <binding-id>\n  trial [--target agent-id] [--sample 1..20] [--reuse run-id --from agent-id] [asset-id ...]\nCredentials and bulk approvals must be supplied by an administrator in the UI.";
export declare function parseWorkflowArguments(args: string[]): {
    route: string;
    body: Record<string, unknown>;
    proposalFile: string;
} | {
    route: string;
    body: Record<string, unknown>;
    proposalFile: undefined;
};
