export type VmCommandHandlerContext = {
  now(): Date;
};

export interface VmCommandHandler {
  readonly path: string;
  handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown>;
}

export class VmCommandDeduplicationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VmCommandDeduplicationError";
  }
}

export type VmCommandRouterOptions = {
  maxCachedCommandResults?: number;
};

type CachedCommandResult = {
  messageType: string;
  requestFingerprint: string;
  response: unknown;
};

type InFlightCommandResult = {
  messageType: string;
  requestFingerprint: string;
  promise: Promise<unknown>;
};

const DefaultMaxCachedCommandResults = 1000;

export class VmCommandRouter {
  private readonly handlers = new Map<string, VmCommandHandler>();
  private readonly commandResults = new Map<string, CachedCommandResult>();
  private readonly inFlightCommands = new Map<string, InFlightCommandResult>();
  private readonly maxCachedCommandResults: number;

  constructor(handlers: VmCommandHandler[] = [], options: VmCommandRouterOptions = {}) {
    this.maxCachedCommandResults = Math.max(0, options.maxCachedCommandResults ?? DefaultMaxCachedCommandResults);

    for (const handler of handlers) {
      this.register(handler);
    }
  }

  register(handler: VmCommandHandler): void {
    this.handlers.set(handler.path, handler);
  }

  has(path: string): boolean {
    return this.handlers.has(path);
  }

  async dispatch(path: string, body: unknown, context: VmCommandHandlerContext): Promise<unknown | undefined> {
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
    } catch (error) {
      const current = this.inFlightCommands.get(envelope.commandId);

      if (current?.promise === promise) {
        this.inFlightCommands.delete(envelope.commandId);
      }

      throw error;
    }
  }

  private cacheCommandResult(commandId: string, result: CachedCommandResult): void {
    if (this.maxCachedCommandResults <= 0) {
      return;
    }

    this.commandResults.set(commandId, result);

    while (this.commandResults.size > this.maxCachedCommandResults) {
      const oldestCommandId = this.commandResults.keys().next().value as string | undefined;

      if (!oldestCommandId) {
        break;
      }

      this.commandResults.delete(oldestCommandId);
    }
  }
}

type CommandEnvelopeIdentity = {
  commandId: string;
  messageType: string;
  requestFingerprint: string;
};

function commandEnvelopeIdentity(body: unknown): CommandEnvelopeIdentity | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const candidate = body as { commandId?: unknown; messageType?: unknown };

  if (typeof candidate.commandId !== "string" || typeof candidate.messageType !== "string") {
    return null;
  }

  return {
    commandId: candidate.commandId,
    messageType: candidate.messageType,
    requestFingerprint: stableJsonStringify(envelopeFingerprint(body as Record<string, unknown>)),
  };
}

function assertCommandEntryMatches(
  envelope: CommandEnvelopeIdentity,
  cached: Pick<CachedCommandResult, "messageType" | "requestFingerprint">
): void {
  if (cached.messageType !== envelope.messageType) {
    throw new VmCommandDeduplicationError("VM commandId was reused for a different messageType");
  }

  if (cached.requestFingerprint !== envelope.requestFingerprint) {
    throw new VmCommandDeduplicationError("VM commandId was reused for a different command payload");
  }
}

function envelopeFingerprint(body: Record<string, unknown>): Record<string, unknown> {
  const fingerprint: Record<string, unknown> = {};

  for (const key of Object.keys(body)) {
    if (key !== "ts") {
      fingerprint[key] = body[key];
    }
  }

  return fingerprint;
}

function stableJsonStringify(value: unknown): string {
  return JSON.stringify(stableJsonValue(value));
}

function stableJsonValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stableJsonValue);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  const record = value as Record<string, unknown>;
  const sorted: Record<string, unknown> = {};

  for (const key of Object.keys(record).sort()) {
    if (record[key] !== undefined) {
      sorted[key] = stableJsonValue(record[key]);
    }
  }

  return sorted;
}
