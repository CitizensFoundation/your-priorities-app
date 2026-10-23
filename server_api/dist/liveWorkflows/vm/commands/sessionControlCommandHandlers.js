import { YP_LIVE_WORKFLOW_VM_PROTOCOL, VmSessionApprovalRespondCommandEnvelopeSchema, VmSessionCommandAckResponseEnvelopeSchema, VmSessionInjectItemsCommandEnvelopeSchema, VmSessionInterruptCommandEnvelopeSchema, VmSessionPauseCommandEnvelopeSchema, VmSessionResumeCommandEnvelopeSchema, VmSessionReviewStartCommandEnvelopeSchema, VmSessionTerminateCommandEnvelopeSchema, VmSessionThreadForkCommandEnvelopeSchema, VmSessionTurnStartCommandEnvelopeSchema, VmSessionTurnSteerCommandEnvelopeSchema, VmWorkspaceArchiveCommandEnvelopeSchema, } from "../../contracts/index.js";
import { VmCommandValidationError } from "./runtimeEnsureImageCommandHandler.js";
export class SessionResumeCommandHandler {
    constructor(codex) {
        this.codex = codex;
        this.path = "/commands/session.resume";
    }
    async handle(body, context) {
        const envelope = VmSessionResumeCommandEnvelopeSchema.parse(body);
        return sessionCommandAckResponse("session.resume", envelope.commandId, context, await this.codex.resumeSession(envelope.data));
    }
}
export class SessionPauseCommandHandler {
    constructor(codex) {
        this.codex = codex;
        this.path = "/commands/session.pause";
    }
    async handle(body, context) {
        const envelope = VmSessionPauseCommandEnvelopeSchema.parse(body);
        return sessionCommandAckResponse("session.pause", envelope.commandId, context, await this.codex.pauseSession(envelope.data));
    }
}
export class SessionThreadForkCommandHandler {
    constructor(codex) {
        this.codex = codex;
        this.path = "/commands/session.thread.fork";
    }
    async handle(body, context) {
        const envelope = VmSessionThreadForkCommandEnvelopeSchema.parse(body);
        return sessionCommandAckResponse("session.thread.fork", envelope.commandId, context, await this.codex.forkThread(envelope.data));
    }
}
export class SessionTurnStartCommandHandler {
    constructor(codex) {
        this.codex = codex;
        this.path = "/commands/session.turn.start";
    }
    async handle(body, context) {
        const envelope = VmSessionTurnStartCommandEnvelopeSchema.parse(body);
        return sessionCommandAckResponse("session.turn.start", envelope.commandId, context, await this.codex.startTurn(envelope.data));
    }
}
export class SessionTurnSteerCommandHandler {
    constructor(codex) {
        this.codex = codex;
        this.path = "/commands/session.turn.steer";
    }
    async handle(body, context) {
        const envelope = VmSessionTurnSteerCommandEnvelopeSchema.parse(body);
        return sessionCommandAckResponse("session.turn.steer", envelope.commandId, context, await this.codex.steerTurn(envelope.data));
    }
}
export class SessionInjectItemsCommandHandler {
    constructor(codex) {
        this.codex = codex;
        this.path = "/commands/session.inject_items";
    }
    async handle(body, context) {
        const envelope = VmSessionInjectItemsCommandEnvelopeSchema.parse(body);
        return sessionCommandAckResponse("session.inject_items", envelope.commandId, context, await this.codex.injectItems(envelope.data));
    }
}
export class SessionInterruptCommandHandler {
    constructor(codex) {
        this.codex = codex;
        this.path = "/commands/session.interrupt";
    }
    async handle(body, context) {
        const envelope = VmSessionInterruptCommandEnvelopeSchema.parse(body);
        return sessionCommandAckResponse("session.interrupt", envelope.commandId, context, await this.codex.interruptTurn(envelope.data));
    }
}
export class SessionApprovalRespondCommandHandler {
    constructor(codex) {
        this.codex = codex;
        this.path = "/commands/session.approval.respond";
    }
    async handle(body, context) {
        const envelope = VmSessionApprovalRespondCommandEnvelopeSchema.parse(body);
        return sessionCommandAckResponse("session.approval.respond", envelope.commandId, context, await this.codex.respondToApproval(envelope.data));
    }
}
export class SessionReviewStartCommandHandler {
    constructor(codex) {
        this.codex = codex;
        this.path = "/commands/session.review.start";
    }
    async handle(body, context) {
        const envelope = VmSessionReviewStartCommandEnvelopeSchema.parse(body);
        return sessionCommandAckResponse("session.review.start", envelope.commandId, context, await this.codex.startReview(envelope.data));
    }
}
export class SessionTerminateCommandHandler {
    constructor(codex, dockerRuntime, auxTerminalBridge) {
        this.codex = codex;
        this.dockerRuntime = dockerRuntime;
        this.auxTerminalBridge = auxTerminalBridge;
        this.path = "/commands/session.terminate";
    }
    async handle(body, context) {
        const envelope = VmSessionTerminateCommandEnvelopeSchema.parse(body);
        const sessionId = envelope.data.sessionId;
        this.auxTerminalBridge.closeSession(sessionId);
        let adapterClosed = false;
        let session = this.dockerRuntime.getSession(sessionId);
        try {
            adapterClosed = await this.codex.closeSession(sessionId);
        }
        finally {
            session = await this.dockerRuntime.terminateSession(sessionId);
        }
        if (!adapterClosed && !session) {
            throw new VmCommandValidationError(`VM agent session was not found: ${sessionId}`);
        }
        return sessionCommandAckResponse("session.terminate", envelope.commandId, context, {
            ok: true,
            commandId: envelope.commandId,
            sessionId,
            result: {
                adapterClosed,
                session: session,
            },
        });
    }
}
export class WorkspaceArchiveCommandHandler {
    constructor(codex, dockerRuntime, auxTerminalBridge) {
        this.codex = codex;
        this.dockerRuntime = dockerRuntime;
        this.auxTerminalBridge = auxTerminalBridge;
        this.path = "/commands/workspace.archive";
    }
    async handle(body, context) {
        const envelope = VmWorkspaceArchiveCommandEnvelopeSchema.parse(body);
        const sessionId = envelope.data.sessionId;
        const currentSession = this.dockerRuntime.getSession(sessionId);
        if (!currentSession) {
            throw new VmCommandValidationError(`VM agent session was not found: ${sessionId}`);
        }
        if (envelope.data.workspaceId && currentSession.workspaceId !== envelope.data.workspaceId) {
            throw new VmCommandValidationError(`VM agent session does not belong to workspace: ${envelope.data.workspaceId}`);
        }
        this.auxTerminalBridge.closeSession(sessionId);
        await this.codex.closeSession(sessionId);
        const session = await this.dockerRuntime.archiveSession(sessionId);
        return sessionCommandAckResponse("workspace.archive", envelope.commandId, context, {
            ok: true,
            commandId: envelope.commandId,
            sessionId,
            result: {
                session: session,
            },
        });
    }
}
function sessionCommandAckResponse(messageType, commandId, context, data) {
    return VmSessionCommandAckResponseEnvelopeSchema.parse({
        ok: true,
        protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
        messageType,
        commandId,
        ts: context.now().toISOString(),
        data,
    });
}
