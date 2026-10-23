import { VmAuxTerminalAckPayloadSchema, VmAuxTerminalCloseCommandEnvelopeSchema, VmAuxTerminalClosedPayloadSchema, VmAuxTerminalInputCommandEnvelopeSchema, VmAuxTerminalOpenCommandEnvelopeSchema, VmAuxTerminalOpenedPayloadSchema, VmAuxTerminalResizeCommandEnvelopeSchema, } from "../../contracts/index.js";
import { DockerAuxTerminalTargetError, } from "../docker/dockerRuntimeManager.js";
import { VmCommandValidationError } from "./runtimeEnsureImageCommandHandler.js";
export class AuxTerminalOpenCommandHandler {
    constructor(terminals, dockerRuntime) {
        this.terminals = terminals;
        this.dockerRuntime = dockerRuntime;
        this.path = "/commands/session.aux_terminal.open";
    }
    async handle(body) {
        const envelope = VmAuxTerminalOpenCommandEnvelopeSchema.parse(body);
        const session = this.dockerRuntime.getSession(envelope.data.sessionId);
        if (!session) {
            throw new VmCommandValidationError(`Docker session was not found: ${envelope.data.sessionId}`);
        }
        let target;
        try {
            target = await this.dockerRuntime.createAuxTerminalTarget(session, {
                preferredShell: this.terminals.preferredShell,
            });
        }
        catch (error) {
            if (error instanceof DockerAuxTerminalTargetError) {
                throw new VmCommandValidationError(error.message);
            }
            throw error;
        }
        return VmAuxTerminalOpenedPayloadSchema.parse(await this.terminals.openTerminal(envelope.commandId, session, {
            cols: envelope.data.cols,
            rows: envelope.data.rows,
            target,
        }));
    }
}
export class AuxTerminalInputCommandHandler {
    constructor(terminals) {
        this.terminals = terminals;
        this.path = "/commands/session.aux_terminal.input";
    }
    async handle(body) {
        const envelope = VmAuxTerminalInputCommandEnvelopeSchema.parse(body);
        return VmAuxTerminalAckPayloadSchema.parse(this.terminals.writeInput(envelope.commandId, envelope.data.sessionId, envelope.data.terminalId, envelope.data.data));
    }
}
export class AuxTerminalResizeCommandHandler {
    constructor(terminals) {
        this.terminals = terminals;
        this.path = "/commands/session.aux_terminal.resize";
    }
    async handle(body) {
        const envelope = VmAuxTerminalResizeCommandEnvelopeSchema.parse(body);
        return VmAuxTerminalAckPayloadSchema.parse(this.terminals.resizeTerminal(envelope.commandId, envelope.data.sessionId, envelope.data.terminalId, envelope.data.cols, envelope.data.rows));
    }
}
export class AuxTerminalCloseCommandHandler {
    constructor(terminals) {
        this.terminals = terminals;
        this.path = "/commands/session.aux_terminal.close";
    }
    async handle(body) {
        const envelope = VmAuxTerminalCloseCommandEnvelopeSchema.parse(body);
        return VmAuxTerminalClosedPayloadSchema.parse(this.terminals.closeTerminal(envelope.commandId, envelope.data.sessionId, envelope.data.terminalId));
    }
}
