import { type WorkspaceFileMaterializePayload, type WorkspaceFileMaterializedPayload, type WorkspacePreparePayload, type WorkspacePreparedLayout, type WorkspacePreparedPayload } from "../../contracts/index.js";
export type WorkspaceLayout = {
    rootPath: string;
    workspacePath: string;
    codexHomePath: string;
    artifactsPath: string;
    cachePath: string;
    datasetOutputPath?: string;
};
export type WorkspaceDirectoryPresence = {
    workspace: boolean;
    codexHome: boolean;
    artifacts: boolean;
    cache: boolean;
};
export type WorkspaceGitCloneOptions = {
    credentialHelperPath?: string | null;
};
export type WorkspaceGitLocalConfigOptions = {
    allowUnsafeCredentialHelper?: boolean;
};
export type WorkspaceListEntry = {
    rootPath: string;
    layout: WorkspaceLayout;
    directories: WorkspaceDirectoryPresence;
};
export interface WorkspaceGitAdapter {
    clone(repoUrl: string, workspacePath: string, options?: WorkspaceGitCloneOptions): Promise<void>;
    fetch(workspacePath: string): Promise<void>;
    pull(workspacePath: string): Promise<void>;
    checkout(workspacePath: string, ref: string): Promise<void>;
    currentRef(workspacePath: string): Promise<string | null>;
    currentCommit(workspacePath: string): Promise<string | null>;
    setRemoteUrl(workspacePath: string, remoteName: string, repoUrl: string): Promise<void>;
    setLocalConfig(workspacePath: string, key: string, value: string, options?: WorkspaceGitLocalConfigOptions): Promise<void>;
}
export type WorkspaceManagerOptions = {
    git?: WorkspaceGitAdapter;
    now?: () => Date;
    allowedRootPath?: string;
    allowedDatasetOutputRootPath?: string;
};
export declare class WorkspaceManager {
    private readonly git;
    private readonly now;
    private readonly allowedRootPath?;
    private readonly allowedDatasetOutputRootPath?;
    constructor(options?: WorkspaceManagerOptions);
    describeLayout(rootPath: string, datasetOutputPath?: string): WorkspaceLayout;
    listWorkspaces(rootPath?: string): Promise<WorkspaceListEntry[]>;
    validateSessionLayout(input: WorkspacePreparedLayout): Promise<WorkspaceLayout>;
    prepareWorkspace(input: WorkspacePreparePayload): Promise<WorkspacePreparedPayload>;
    materializeWorkspaceFile(input: WorkspaceFileMaterializePayload, content: AsyncIterable<Buffer | Uint8Array | string> | Iterable<Buffer | Uint8Array | string>): Promise<WorkspaceFileMaterializedPayload>;
    private ensureLayout;
    private prepareRepository;
    private prepareGitHubFolder;
    private writeGitHubFolderCredentialHelper;
    private writeGitHubFolderTemporaryCredentialHelper;
    private writeGitHubFolderCredentialHelperFile;
    private configureGitHubFolderCredentialHelper;
    private configureGitHubFolderCommitIdentity;
    private materializeFiles;
    private writeManagedFile;
    private writeTransferredFile;
    private validateRootPath;
    private workspaceListEntry;
}
