export type VmAgentConsoleEventSource = "vm" | "codex";
export type VmAgentConsoleEvent = {
    source: VmAgentConsoleEventSource;
    event: string;
    fields?: Record<string, string | number | boolean | null | undefined>;
};
export type VmAgentConsoleEventSink = (event: VmAgentConsoleEvent) => void;
export declare function createVmAgentConsoleEventSink(options?: {
    colors?: boolean;
    write?: (line: string) => void;
}): VmAgentConsoleEventSink;
export declare function formatVmAgentConsoleEvent(event: VmAgentConsoleEvent, options?: {
    colors?: boolean;
}): string;
