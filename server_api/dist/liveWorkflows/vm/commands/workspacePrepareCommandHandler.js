import { YP_LIVE_WORKFLOW_VM_PROTOCOL, VmWorkspacePrepareCommandEnvelopeSchema, VmWorkspacePreparedResponseEnvelopeSchema, } from "../../contracts/index.js";
export class WorkspacePrepareCommandHandler {
    constructor(workspaceManager) {
        this.workspaceManager = workspaceManager;
        this.path = "/commands/workspace.prepare";
    }
    async handle(body, context) {
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
