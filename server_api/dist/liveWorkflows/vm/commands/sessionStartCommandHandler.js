import { YP_LIVE_WORKFLOW_VM_PROTOCOL, VmSessionStartCommandEnvelopeSchema, VmSessionStartedResponseEnvelopeSchema, } from "../../contracts/index.js";
const NoopVmSessionEventSink = {
    async publishSessionEvent() {
        return undefined;
    },
};
export class SessionStartCommandHandler {
    constructor(codex, workspaces, sessionEvents = NoopVmSessionEventSink) {
        this.codex = codex;
        this.workspaces = workspaces;
        this.sessionEvents = sessionEvents;
        this.path = "/commands/session.start";
    }
    async handle(body, context) {
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
    publishSessionEvent(event) {
        void this.sessionEvents.publishSessionEvent(event).catch((error) => {
            console.error("Failed to publish Codex session event", error);
        });
    }
}
