import {
  YP_LIVE_WORKFLOW_VM_PROTOCOL,
  VmSessionStartCommandEnvelopeSchema,
  type VmSessionEventPayload,
  VmSessionStartedResponseEnvelopeSchema,
} from "../../contracts/index.js";
import type { CodexAdapter } from "../codex/codexAdapter.js";
import type { WorkspaceManager } from "../workspace/workspaceManager.js";
import type { VmCommandHandler, VmCommandHandlerContext } from "./vmCommandRouter.js";

export interface VmSessionEventSink {
  publishSessionEvent(event: VmSessionEventPayload): Promise<void>;
}

const NoopVmSessionEventSink: VmSessionEventSink = {
  async publishSessionEvent() {
    return undefined;
  },
};

export class SessionStartCommandHandler implements VmCommandHandler {
  readonly path = "/commands/session.start";

  constructor(
    private readonly codex: CodexAdapter,
    private readonly workspaces: WorkspaceManager,
    private readonly sessionEvents: VmSessionEventSink = NoopVmSessionEventSink
  ) {}

  async handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown> {
    const envelope = VmSessionStartCommandEnvelopeSchema.parse(body);
    await this.workspaces.validateSessionLayout(envelope.data.layout);
    const started = await this.codex.startSession(envelope.data, {
      onEvent: (event) => this.publishSessionEvent(event),
    });
    const { events: _events, ...data } = started;

    return VmSessionStartedResponseEnvelopeSchema.parse({
      ok: true,
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "session.started",
      commandId: envelope.commandId,
      ts: context.now().toISOString(),
      data,
    });
  }

  private publishSessionEvent(event: VmSessionEventPayload): void {
    void this.sessionEvents.publishSessionEvent(event).catch((error) => {
      console.error("Failed to publish Codex session event", error);
    });
  }
}
