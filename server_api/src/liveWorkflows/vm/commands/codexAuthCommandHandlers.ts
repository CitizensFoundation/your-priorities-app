import {
  YP_LIVE_WORKFLOW_VM_PROTOCOL,
  VmCodexAuthLoginCancelCommandEnvelopeSchema,
  VmCodexAuthLoginCancelledResponseEnvelopeSchema,
  VmCodexAuthLoginCompleteCommandEnvelopeSchema,
  VmCodexAuthLoginCompletedResponseEnvelopeSchema,
  VmCodexAuthLoginStartCommandEnvelopeSchema,
  VmCodexAuthLoginStartedResponseEnvelopeSchema,
} from "../../contracts/index.js";
import type { CodexAdapter } from "../codex/codexAdapter.js";
import type { WorkspaceManager } from "../workspace/workspaceManager.js";
import type { VmCommandHandler, VmCommandHandlerContext } from "./vmCommandRouter.js";

export class CodexAuthLoginStartCommandHandler implements VmCommandHandler {
  readonly path = "/commands/codex.auth.login.start";

  constructor(
    private readonly codex: CodexAdapter,
    private readonly workspaces: WorkspaceManager
  ) {}

  async handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown> {
    const envelope = VmCodexAuthLoginStartCommandEnvelopeSchema.parse(body);
    await this.validateAuthRoot(envelope.data.rootPath);
    const started = await this.codex.startAuthLogin(envelope.data);

    return VmCodexAuthLoginStartedResponseEnvelopeSchema.parse({
      ok: true,
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "codex.auth.login.started",
      commandId: envelope.commandId,
      ts: context.now().toISOString(),
      data: started,
    });
  }

  private async validateAuthRoot(rootPath: string): Promise<void> {
    const layout = this.workspaces.describeLayout(rootPath);
    await this.workspaces.validateSessionLayout({
      rootPath: layout.rootPath,
      workspacePath: layout.workspacePath,
      codexHomePath: layout.codexHomePath,
      artifactsPath: layout.artifactsPath,
      cachePath: layout.cachePath,
    });
  }
}

export class CodexAuthLoginCompleteCommandHandler implements VmCommandHandler {
  readonly path = "/commands/codex.auth.login.complete";

  constructor(private readonly codex: CodexAdapter) {}

  async handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown> {
    const envelope = VmCodexAuthLoginCompleteCommandEnvelopeSchema.parse(body);
    const completed = await this.codex.completeAuthLogin(envelope.data);

    return VmCodexAuthLoginCompletedResponseEnvelopeSchema.parse({
      ok: true,
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "codex.auth.login.completed",
      commandId: envelope.commandId,
      ts: context.now().toISOString(),
      data: completed,
    });
  }
}

export class CodexAuthLoginCancelCommandHandler implements VmCommandHandler {
  readonly path = "/commands/codex.auth.login.cancel";

  constructor(private readonly codex: CodexAdapter) {}

  async handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown> {
    const envelope = VmCodexAuthLoginCancelCommandEnvelopeSchema.parse(body);
    const cancelled = await this.codex.cancelAuthLogin(envelope.data);

    return VmCodexAuthLoginCancelledResponseEnvelopeSchema.parse({
      ok: true,
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "codex.auth.login.cancelled",
      commandId: envelope.commandId,
      ts: context.now().toISOString(),
      data: cancelled,
    });
  }
}
