import { ArtifactCollector } from "../artifacts/artifactCollector.js";
import { CodexAdapter } from "../codex/codexAdapter.js";
import { HostRegistrar } from "../host/hostRegistrar.js";
import { MetricsReporter } from "../metrics/metricsReporter.js";
import type { StartVmAgentOptions } from "../runtime.js";
import { AuxTerminalBridge } from "../terminal/auxTerminalBridge.js";
import { WorkspaceManager } from "../workspace/workspaceManager.js";
export declare class VmAgentSkeleton {
    readonly protocol: "yp-live-workflow.vm.v1";
    readonly artifacts: ArtifactCollector;
    readonly codex: CodexAdapter;
    readonly host: HostRegistrar;
    readonly metrics: MetricsReporter;
    readonly terminal: AuxTerminalBridge;
    readonly workspaces: WorkspaceManager;
    createRuntimeOptions(): Pick<StartVmAgentOptions, "hostRegistrar" | "metricsReporter" | "workspaceManager">;
}
