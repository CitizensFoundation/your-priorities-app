/** The CLI is copied into an isolated workspace, without the rest of the host runtime. */
export declare function writeWorkflowCli(directory: string, readArtifact?: (name: string) => Promise<string>): Promise<void>;
