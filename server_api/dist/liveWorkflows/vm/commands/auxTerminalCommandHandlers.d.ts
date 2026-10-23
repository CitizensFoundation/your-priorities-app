import { type DockerRuntimeManager } from "../docker/dockerRuntimeManager.js";
import type { AuxTerminalBridge } from "../terminal/auxTerminalBridge.js";
import type { VmCommandHandler } from "./vmCommandRouter.js";
export declare class AuxTerminalOpenCommandHandler implements VmCommandHandler {
    private readonly terminals;
    private readonly dockerRuntime;
    readonly path = "/commands/session.aux_terminal.open";
    constructor(terminals: AuxTerminalBridge, dockerRuntime: DockerRuntimeManager);
    handle(body: unknown): Promise<unknown>;
}
export declare class AuxTerminalInputCommandHandler implements VmCommandHandler {
    private readonly terminals;
    readonly path = "/commands/session.aux_terminal.input";
    constructor(terminals: AuxTerminalBridge);
    handle(body: unknown): Promise<unknown>;
}
export declare class AuxTerminalResizeCommandHandler implements VmCommandHandler {
    private readonly terminals;
    readonly path = "/commands/session.aux_terminal.resize";
    constructor(terminals: AuxTerminalBridge);
    handle(body: unknown): Promise<unknown>;
}
export declare class AuxTerminalCloseCommandHandler implements VmCommandHandler {
    private readonly terminals;
    readonly path = "/commands/session.aux_terminal.close";
    constructor(terminals: AuxTerminalBridge);
    handle(body: unknown): Promise<unknown>;
}
