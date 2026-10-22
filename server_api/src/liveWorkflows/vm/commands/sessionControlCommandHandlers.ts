import {
  YP_LIVE_WORKFLOW_VM_PROTOCOL,
  VmSessionApprovalRespondCommandEnvelopeSchema,
  VmSessionCommandAckResponseEnvelopeSchema,
  VmSessionInjectItemsCommandEnvelopeSchema,
  VmSessionInterruptCommandEnvelopeSchema,
  VmSessionPauseCommandEnvelopeSchema,
  VmSessionResumeCommandEnvelopeSchema,
  VmSessionReviewStartCommandEnvelopeSchema,
  VmSessionTerminateCommandEnvelopeSchema,
  VmSessionThreadForkCommandEnvelopeSchema,
  VmSessionTurnStartCommandEnvelopeSchema,
  VmSessionTurnSteerCommandEnvelopeSchema,
  VmWorkspaceArchiveCommandEnvelopeSchema,
  type Json,
  type VmSessionControlCommand,
} from "../../contracts/index.js";
import type { CodexAdapter } from "../codex/codexAdapter.js";
import type { DockerRuntimeManager } from "../docker/dockerRuntimeManager.js";
import type { AuxTerminalBridge } from "../terminal/auxTerminalBridge.js";
import { VmCommandValidationError } from "./runtimeEnsureImageCommandHandler.js";
import type { VmCommandHandler, VmCommandHandlerContext } from "./vmCommandRouter.js";

export class SessionResumeCommandHandler implements VmCommandHandler {
  readonly path = "/commands/session.resume";

  constructor(private readonly codex: CodexAdapter) {}

  async handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown> {
    const envelope = VmSessionResumeCommandEnvelopeSchema.parse(body);
    return sessionCommandAckResponse("session.resume", envelope.commandId, context, await this.codex.resumeSession(envelope.data));
  }
}

export class SessionPauseCommandHandler implements VmCommandHandler {
  readonly path = "/commands/session.pause";

  constructor(private readonly codex: CodexAdapter) {}

  async handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown> {
    const envelope = VmSessionPauseCommandEnvelopeSchema.parse(body);
    return sessionCommandAckResponse("session.pause", envelope.commandId, context, await this.codex.pauseSession(envelope.data));
  }
}

export class SessionThreadForkCommandHandler implements VmCommandHandler {
  readonly path = "/commands/session.thread.fork";

  constructor(private readonly codex: CodexAdapter) {}

  async handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown> {
    const envelope = VmSessionThreadForkCommandEnvelopeSchema.parse(body);
    return sessionCommandAckResponse("session.thread.fork", envelope.commandId, context, await this.codex.forkThread(envelope.data));
  }
}

export class SessionTurnStartCommandHandler implements VmCommandHandler {
  readonly path = "/commands/session.turn.start";

  constructor(private readonly codex: CodexAdapter) {}

  async handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown> {
    const envelope = VmSessionTurnStartCommandEnvelopeSchema.parse(body);
    return sessionCommandAckResponse("session.turn.start", envelope.commandId, context, await this.codex.startTurn(envelope.data));
  }
}

export class SessionTurnSteerCommandHandler implements VmCommandHandler {
  readonly path = "/commands/session.turn.steer";

  constructor(private readonly codex: CodexAdapter) {}

  async handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown> {
    const envelope = VmSessionTurnSteerCommandEnvelopeSchema.parse(body);
    return sessionCommandAckResponse("session.turn.steer", envelope.commandId, context, await this.codex.steerTurn(envelope.data));
  }
}

export class SessionInjectItemsCommandHandler implements VmCommandHandler {
  readonly path = "/commands/session.inject_items";

  constructor(private readonly codex: CodexAdapter) {}

  async handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown> {
    const envelope = VmSessionInjectItemsCommandEnvelopeSchema.parse(body);
    return sessionCommandAckResponse("session.inject_items", envelope.commandId, context, await this.codex.injectItems(envelope.data));
  }
}

export class SessionInterruptCommandHandler implements VmCommandHandler {
  readonly path = "/commands/session.interrupt";

  constructor(private readonly codex: CodexAdapter) {}

  async handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown> {
    const envelope = VmSessionInterruptCommandEnvelopeSchema.parse(body);
    return sessionCommandAckResponse("session.interrupt", envelope.commandId, context, await this.codex.interruptTurn(envelope.data));
  }
}

export class SessionApprovalRespondCommandHandler implements VmCommandHandler {
  readonly path = "/commands/session.approval.respond";

  constructor(private readonly codex: CodexAdapter) {}

  async handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown> {
    const envelope = VmSessionApprovalRespondCommandEnvelopeSchema.parse(body);
    return sessionCommandAckResponse(
      "session.approval.respond",
      envelope.commandId,
      context,
      await this.codex.respondToApproval(envelope.data)
    );
  }
}

export class SessionReviewStartCommandHandler implements VmCommandHandler {
  readonly path = "/commands/session.review.start";

  constructor(private readonly codex: CodexAdapter) {}

  async handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown> {
    const envelope = VmSessionReviewStartCommandEnvelopeSchema.parse(body);
    return sessionCommandAckResponse("session.review.start", envelope.commandId, context, await this.codex.startReview(envelope.data));
  }
}

export class SessionTerminateCommandHandler implements VmCommandHandler {
  readonly path = "/commands/session.terminate";

  constructor(
    private readonly codex: CodexAdapter,
    private readonly dockerRuntime: DockerRuntimeManager,
    private readonly auxTerminalBridge: AuxTerminalBridge
  ) {}

  async handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown> {
    const envelope = VmSessionTerminateCommandEnvelopeSchema.parse(body);
    const sessionId = envelope.data.sessionId;
    this.auxTerminalBridge.closeSession(sessionId);
    let adapterClosed = false;
    let session = this.dockerRuntime.getSession(sessionId);
    try {
      adapterClosed = await this.codex.closeSession(sessionId);
    } finally {
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
        session: session as unknown as Json,
      },
    });
  }
}

export class WorkspaceArchiveCommandHandler implements VmCommandHandler {
  readonly path = "/commands/workspace.archive";

  constructor(
    private readonly codex: CodexAdapter,
    private readonly dockerRuntime: DockerRuntimeManager,
    private readonly auxTerminalBridge: AuxTerminalBridge
  ) {}

  async handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown> {
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
        session: session as unknown as Json,
      },
    });
  }
}

function sessionCommandAckResponse(
  messageType: VmSessionControlCommand,
  commandId: string,
  context: VmCommandHandlerContext,
  data: unknown
): unknown {
  return VmSessionCommandAckResponseEnvelopeSchema.parse({
    ok: true,
    protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
    messageType,
    commandId,
    ts: context.now().toISOString(),
    data,
  });
}
