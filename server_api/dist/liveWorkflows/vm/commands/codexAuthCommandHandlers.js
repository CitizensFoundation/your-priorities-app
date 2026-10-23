import { YP_LIVE_WORKFLOW_VM_PROTOCOL, VmCodexAuthLoginCancelCommandEnvelopeSchema, VmCodexAuthLoginCancelledResponseEnvelopeSchema, VmCodexAuthLoginCompleteCommandEnvelopeSchema, VmCodexAuthLoginCompletedResponseEnvelopeSchema, VmCodexAuthLoginStartCommandEnvelopeSchema, VmCodexAuthLoginStartedResponseEnvelopeSchema, } from "../../contracts/index.js";
export class CodexAuthLoginStartCommandHandler {
    constructor(codex, workspaces) {
        this.codex = codex;
        this.workspaces = workspaces;
        this.path = "/commands/codex.auth.login.start";
    }
    async handle(body, context) {
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
    async validateAuthRoot(rootPath) {
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
export class CodexAuthLoginCompleteCommandHandler {
    constructor(codex) {
        this.codex = codex;
        this.path = "/commands/codex.auth.login.complete";
    }
    async handle(body, context) {
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
export class CodexAuthLoginCancelCommandHandler {
    constructor(codex) {
        this.codex = codex;
        this.path = "/commands/codex.auth.login.cancel";
    }
    async handle(body, context) {
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
