import type { VmSessionEventPayload, VmSessionStartPayload } from "../../contracts/index.js";
import type { JsonRpcMessage } from "./appServerTransport.js";
export type CodexSessionEventHandler = (event: VmSessionEventPayload) => void | Promise<void>;
export declare function normalizeCodexNotification(payload: VmSessionStartPayload, message: JsonRpcMessage, seq: number, vmEventStreamId?: string | null): VmSessionEventPayload | null;
export declare function publishSessionEvent(handler: CodexSessionEventHandler | undefined, event: VmSessionEventPayload): void;
