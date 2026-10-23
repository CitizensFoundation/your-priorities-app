const Reset = "\x1b[0m";
const SourceColors = {
    vm: "\x1b[36m",
    codex: "\x1b[35m",
};
export function createVmAgentConsoleEventSink(options = {}) {
    const colors = options.colors ?? true;
    const write = options.write ?? ((line) => console.log(line));
    return (event) => {
        write(formatVmAgentConsoleEvent(event, { colors }));
    };
}
export function formatVmAgentConsoleEvent(event, options = {}) {
    const prefix = options.colors === false
        ? `[${event.source}]`
        : `${SourceColors[event.source]}[${event.source}]${Reset}`;
    const fields = Object.entries(event.fields ?? {})
        .filter((entry) => entry[1] !== undefined && entry[1] !== null)
        .map(([key, value]) => `${key}=${formatFieldValue(value)}`);
    return [prefix, event.event, ...fields].join(" ");
}
function formatFieldValue(value) {
    const raw = String(value);
    return /^[A-Za-z0-9_.:/@+=-]+$/.test(raw) ? raw : JSON.stringify(raw);
}
