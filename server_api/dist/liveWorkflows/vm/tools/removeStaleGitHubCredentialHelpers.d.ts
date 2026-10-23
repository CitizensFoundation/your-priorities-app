export type RemoveStaleGitHubCredentialHelpersResult = {
    dryRun: boolean;
    groupId: number;
    workspaceRoot: string;
    groupExperimentsRoot: string;
    candidates: Array<{
        path: string;
        action: "would_remove" | "removed";
    }>;
    warnings: string[];
};
export declare function removeStaleGitHubCredentialHelpers(input: {
    groupId: number;
    workspaceRoot: string;
    yes?: boolean;
}): Promise<RemoveStaleGitHubCredentialHelpersResult>;
