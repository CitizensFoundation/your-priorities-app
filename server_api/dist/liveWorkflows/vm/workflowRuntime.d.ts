import type { VmAgentConfig } from "./config.js";
import type { CodexAdapter } from "./codex/codexAdapter.js";
import type { VmCommandHandler } from "./commands/vmCommandRouter.js";
/** Trusted host coordinator. Processing containers have no network, host token, Docker socket,
 * ChatGPT auth directory, or provider credentials. All capabilities pass through scoped Unix sockets. */
export declare class WorkflowVmRuntime {
    private readonly config;
    private readonly codex;
    private readonly sockets;
    private readonly runs;
    private readonly outbox;
    private readonly timer;
    constructor(config: VmAgentConfig, codex: CodexAdapter);
    handlers(): VmCommandHandler[];
    private api;
    private location;
    private safeDirectory;
    private directoryHandle;
    private handle;
    private assets;
    private inputs;
    private materialize;
    private image;
    private minimumFreeBytes;
    private checkDisk;
    private imageId;
    private processingIsolation;
    private validateSources;
    private attach;
    private socket;
    private launch;
    private docker;
    recover(): Promise<void>;
    close(): Promise<void>;
}
