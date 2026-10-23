import { YP_LIVE_WORKFLOW_VM_PROTOCOL } from "../../contracts/index.js";
import { ArtifactCollector } from "../artifacts/artifactCollector.js";
import { CodexAdapter } from "../codex/codexAdapter.js";
import { HostRegistrar } from "../host/hostRegistrar.js";
import { MetricsReporter } from "../metrics/metricsReporter.js";
import { AuxTerminalBridge } from "../terminal/auxTerminalBridge.js";
import { WorkspaceManager } from "../workspace/workspaceManager.js";
export class VmAgentSkeleton {
    constructor() {
        this.protocol = YP_LIVE_WORKFLOW_VM_PROTOCOL;
        this.artifacts = new ArtifactCollector();
        this.codex = new CodexAdapter();
        this.host = new HostRegistrar();
        this.metrics = new MetricsReporter();
        this.terminal = new AuxTerminalBridge();
        this.workspaces = new WorkspaceManager();
    }
    createRuntimeOptions() {
        return {
            hostRegistrar: this.host,
            metricsReporter: this.metrics,
            workspaceManager: this.workspaces,
        };
    }
}
