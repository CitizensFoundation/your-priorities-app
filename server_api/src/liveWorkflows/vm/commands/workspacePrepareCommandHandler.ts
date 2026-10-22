import {
  YP_LIVE_WORKFLOW_VM_PROTOCOL,
  VmWorkspacePrepareCommandEnvelopeSchema,
  VmWorkspacePreparedResponseEnvelopeSchema,
} from "../../contracts/index.js";
import type { WorkspaceManager } from "../workspace/workspaceManager.js";
import type { VmCommandHandler, VmCommandHandlerContext } from "./vmCommandRouter.js";

export class WorkspacePrepareCommandHandler implements VmCommandHandler {
  readonly path = "/commands/workspace.prepare";

  constructor(private readonly workspaceManager: WorkspaceManager) {}

  async handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown> {
    const envelope = VmWorkspacePrepareCommandEnvelopeSchema.parse(body);
    const prepared = await this.workspaceManager.prepareWorkspace(envelope.data);

    return VmWorkspacePreparedResponseEnvelopeSchema.parse({
      ok: true,
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "workspace.prepared",
      commandId: envelope.commandId,
      ts: context.now().toISOString(),
      data: prepared,
    });
  }
}
