import {
  VmAuxTerminalAckPayloadSchema,
  VmAuxTerminalCloseCommandEnvelopeSchema,
  VmAuxTerminalClosedPayloadSchema,
  VmAuxTerminalInputCommandEnvelopeSchema,
  VmAuxTerminalOpenCommandEnvelopeSchema,
  VmAuxTerminalOpenedPayloadSchema,
  VmAuxTerminalResizeCommandEnvelopeSchema,
} from "../../contracts/index.js";
import {
  DockerAuxTerminalTargetError,
  type DockerAuxTerminalTarget,
  type DockerRuntimeManager,
} from "../docker/dockerRuntimeManager.js";
import type { AuxTerminalBridge } from "../terminal/auxTerminalBridge.js";
import { VmCommandValidationError } from "./runtimeEnsureImageCommandHandler.js";
import type { VmCommandHandler } from "./vmCommandRouter.js";

export class AuxTerminalOpenCommandHandler implements VmCommandHandler {
  readonly path = "/commands/session.aux_terminal.open";

  constructor(
    private readonly terminals: AuxTerminalBridge,
    private readonly dockerRuntime: DockerRuntimeManager
  ) {}

  async handle(body: unknown): Promise<unknown> {
    const envelope = VmAuxTerminalOpenCommandEnvelopeSchema.parse(body);
    const session = this.dockerRuntime.getSession(envelope.data.sessionId);

    if (!session) {
      throw new VmCommandValidationError(`Docker session was not found: ${envelope.data.sessionId}`);
    }

    let target: DockerAuxTerminalTarget;

    try {
      target = await this.dockerRuntime.createAuxTerminalTarget(session, {
        preferredShell: this.terminals.preferredShell,
      });
    } catch (error) {
      if (error instanceof DockerAuxTerminalTargetError) {
        throw new VmCommandValidationError(error.message);
      }

      throw error;
    }

    return VmAuxTerminalOpenedPayloadSchema.parse(
      await this.terminals.openTerminal(envelope.commandId, session, {
        cols: envelope.data.cols,
        rows: envelope.data.rows,
        target,
      })
    );
  }
}

export class AuxTerminalInputCommandHandler implements VmCommandHandler {
  readonly path = "/commands/session.aux_terminal.input";

  constructor(private readonly terminals: AuxTerminalBridge) {}

  async handle(body: unknown): Promise<unknown> {
    const envelope = VmAuxTerminalInputCommandEnvelopeSchema.parse(body);
    return VmAuxTerminalAckPayloadSchema.parse(
      this.terminals.writeInput(
        envelope.commandId,
        envelope.data.sessionId,
        envelope.data.terminalId,
        envelope.data.data
      )
    );
  }
}

export class AuxTerminalResizeCommandHandler implements VmCommandHandler {
  readonly path = "/commands/session.aux_terminal.resize";

  constructor(private readonly terminals: AuxTerminalBridge) {}

  async handle(body: unknown): Promise<unknown> {
    const envelope = VmAuxTerminalResizeCommandEnvelopeSchema.parse(body);
    return VmAuxTerminalAckPayloadSchema.parse(
      this.terminals.resizeTerminal(
        envelope.commandId,
        envelope.data.sessionId,
        envelope.data.terminalId,
        envelope.data.cols,
        envelope.data.rows
      )
    );
  }
}

export class AuxTerminalCloseCommandHandler implements VmCommandHandler {
  readonly path = "/commands/session.aux_terminal.close";

  constructor(private readonly terminals: AuxTerminalBridge) {}

  async handle(body: unknown): Promise<unknown> {
    const envelope = VmAuxTerminalCloseCommandEnvelopeSchema.parse(body);
    return VmAuxTerminalClosedPayloadSchema.parse(
      this.terminals.closeTerminal(envelope.commandId, envelope.data.sessionId, envelope.data.terminalId)
    );
  }
}
