import { YP_LIVE_WORKFLOW_VM_PROTOCOL } from "../../contracts/index.js";
import { ArtifactCollector } from "../artifacts/artifactCollector.js";
import { CodexAdapter } from "../codex/codexAdapter.js";
import { HostRegistrar } from "../host/hostRegistrar.js";
import { MetricsReporter } from "../metrics/metricsReporter.js";
import type { StartVmAgentOptions } from "../runtime.js";
import { AuxTerminalBridge } from "../terminal/auxTerminalBridge.js";
import { WorkspaceManager } from "../workspace/workspaceManager.js";

export class VmAgentSkeleton {
  readonly protocol = YP_LIVE_WORKFLOW_VM_PROTOCOL;
  readonly artifacts = new ArtifactCollector();
  readonly codex = new CodexAdapter();
  readonly host = new HostRegistrar();
  readonly metrics = new MetricsReporter();
  readonly terminal = new AuxTerminalBridge();
  readonly workspaces = new WorkspaceManager();

  createRuntimeOptions(): Pick<StartVmAgentOptions, "hostRegistrar" | "metricsReporter" | "workspaceManager"> {
    return {
      hostRegistrar: this.host,
      metricsReporter: this.metrics,
      workspaceManager: this.workspaces,
    };
  }
}
