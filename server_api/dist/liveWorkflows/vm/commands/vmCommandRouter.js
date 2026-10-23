export class VmCommandDeduplicationError extends Error {
    constructor(message) {
        super(message);
        this.name = "VmCommandDeduplicationError";
    }
}
const DefaultMaxCachedCommandResults = 1000;
export class VmCommandRouter {
    constructor(handlers = [], options = {}) {
        this.handlers = new Map();
        this.commandResults = new Map();
        this.inFlightCommands = new Map();
        this.maxCachedCommandResults = Math.max(0, options.maxCachedCommandResults ?? DefaultMaxCachedCommandResults);
        for (const handler of handlers) {
            this.register(handler);
        }
    }
    register(handler) {
        this.handlers.set(handler.path, handler);
    }
    has(path) {
        return this.handlers.has(path);
    }
    async dispatch(path, body, context) {
        const handler = this.handlers.get(path);
        if (!handler) {
            return undefined;
        }
        const envelope = commandEnvelopeIdentity(body);
        if (!envelope) {
            return await handler.handle(body, context);
        }
        if (path !== `/commands/${envelope.messageType}`) {
            throw new VmCommandDeduplicationError("VM command path does not match messageType");
        }
        const cached = this.commandResults.get(envelope.commandId);
        if (cached) {
            assertCommandEntryMatches(envelope, cached);
            return cached.response;
        }
        const inFlight = this.inFlightCommands.get(envelope.commandId);
        if (inFlight) {
            assertCommandEntryMatches(envelope, inFlight);
            return await inFlight.promise;
        }
        const promise = handler.handle(body, context);
        this.inFlightCommands.set(envelope.commandId, {
            messageType: envelope.messageType,
            requestFingerprint: envelope.requestFingerprint,
            promise,
        });
        try {
            const response = await promise;
            this.inFlightCommands.delete(envelope.commandId);
            this.cacheCommandResult(envelope.commandId, {
                messageType: envelope.messageType,
                requestFingerprint: envelope.requestFingerprint,
                response,
            });
            return response;
        }
        catch (error) {
            const current = this.inFlightCommands.get(envelope.commandId);
            if (current?.promise === promise) {
                this.inFlightCommands.delete(envelope.commandId);
            }
            throw error;
        }
    }
    cacheCommandResult(commandId, result) {
        if (this.maxCachedCommandResults <= 0) {
            return;
        }
        this.commandResults.set(commandId, result);
        while (this.commandResults.size > this.maxCachedCommandResults) {
            const oldestCommandId = this.commandResults.keys().next().value;
            if (!oldestCommandId) {
                break;
            }
            this.commandResults.delete(oldestCommandId);
        }
    }
}
function commandEnvelopeIdentity(body) {
    if (!body || typeof body !== "object") {
        return null;
    }
    const candidate = body;
    if (typeof candidate.commandId !== "string" || typeof candidate.messageType !== "string") {
        return null;
    }
    return {
        commandId: candidate.commandId,
        messageType: candidate.messageType,
        requestFingerprint: stableJsonStringify(envelopeFingerprint(body)),
    };
}
function assertCommandEntryMatches(envelope, cached) {
    if (cached.messageType !== envelope.messageType) {
        throw new VmCommandDeduplicationError("VM commandId was reused for a different messageType");
    }
    if (cached.requestFingerprint !== envelope.requestFingerprint) {
        throw new VmCommandDeduplicationError("VM commandId was reused for a different command payload");
    }
}
function envelopeFingerprint(body) {
    const fingerprint = {};
    for (const key of Object.keys(body)) {
        if (key !== "ts") {
            fingerprint[key] = body[key];
        }
    }
    return fingerprint;
}
function stableJsonStringify(value) {
    return JSON.stringify(stableJsonValue(value));
}
function stableJsonValue(value) {
    if (Array.isArray(value)) {
        return value.map(stableJsonValue);
    }
    if (!value || typeof value !== "object") {
        return value;
    }
    const record = value;
    const sorted = {};
    for (const key of Object.keys(record).sort()) {
        if (record[key] !== undefined) {
            sorted[key] = stableJsonValue(record[key]);
        }
    }
    return sorted;
}
