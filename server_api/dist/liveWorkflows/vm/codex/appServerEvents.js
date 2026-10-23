import { jsonRecord, stringValue } from "./jsonUtils.js";
const RawTraceEventType = "codex.raw";
const SensitiveRawTraceMethods = new Set([
    "account/updated",
    "account/login/completed",
    "mcpServer/oauthLogin/completed",
]);
export function normalizeCodexNotification(payload, message, seq, vmEventStreamId) {
    const method = message.method;
    const params = jsonRecord(message.params);
    const eventType = normalizedEventType(method, params) ?? rawTraceEventType(method);
    if (!eventType) {
        return null;
    }
    const turn = jsonRecord(params.turn);
    const thread = jsonRecord(params.thread);
    const item = jsonRecord(params.item);
    const payloadData = eventType === RawTraceEventType ? rawTracePayload(message) : eventPayload(method, params, message.id);
    return {
        seq,
        ...(vmEventStreamId ? { vmEventStreamId } : {}),
        sessionId: payload.sessionId,
        workspaceId: payload.workspaceId,
        vmHostId: payload.vmHostId,
        eventType,
        codexThreadId: stringValue(params.threadId) ?? stringValue(thread.id) ?? payload.codexThreadId ?? null,
        codexTurnId: stringValue(params.turnId) ?? stringValue(turn.id) ?? null,
        itemId: stringValue(params.itemId) ?? stringValue(item.id) ?? null,
        payload: payloadData,
        rawPayload: rawPayloadForEvent(method, params, message),
    };
}
export function publishSessionEvent(handler, event) {
    if (!handler) {
        return;
    }
    void Promise.resolve(handler(event)).catch((error) => {
        console.error("Codex session event handler failed", error);
    });
}
function normalizedEventType(method, params) {
    switch (method) {
        case "thread/started":
            return "thread.started";
        case "thread/status/changed":
            return "thread.status.changed";
        case "thread/closed":
            return "thread.closed";
        case "turn/started":
            return "turn.started";
        case "turn/plan/updated":
            return "turn.plan.updated";
        case "turn/diff/updated":
            return typeof params.diff === "string" ? "turn.diff.updated" : null;
        case "turn/completed":
            return "turn.completed";
        case "error":
            return "session.error";
        case "item/started":
            if (itemType(params) === "enteredReviewMode") {
                return "review.entered";
            }
            return "item.started";
        case "item/completed":
            if (itemType(params) === "exitedReviewMode") {
                return "review.exited";
            }
            if (itemType(params) === "agentMessage") {
                return "message.completed";
            }
            return "item.completed";
        case "item/agentMessage/delta":
            return "message.delta";
        case "item/commandExecution/outputDelta":
            return "command.output.delta";
        case "item/commandExecution/terminalInteraction":
            return "command.terminal.input";
        case "item/fileChange/outputDelta":
            return "file.output.delta";
        case "item/commandExecution/requestApproval":
        case "item/fileChange/requestApproval":
        case "item/permissions/requestApproval":
        case "item/tool/requestUserInput":
            return "approval.requested";
        case "serverRequest/resolved":
            return "approval.resolved";
        case "thread/tokenUsage/updated":
            return "metrics.updated";
        case "account/rateLimits/updated":
            return "quota.updated";
        case "yp-live-workflow/usageRouting/switched":
            return "usage.routing.switched";
        case "yp-live-workflow/usageRouting/unavailable":
            return "usage.routing.unavailable";
        default:
            return null;
    }
}
function itemType(params) {
    return stringValue(jsonRecord(params.item).type);
}
function rawTraceEventType(method) {
    if (!method || SensitiveRawTraceMethods.has(method)) {
        return null;
    }
    return RawTraceEventType;
}
function rawTracePayload(message) {
    return {
        method: message.method ?? "unknown",
        ...(message.id !== undefined ? { requestId: message.id } : {}),
        ...(message.error ? { error: jsonRecord(message.error) } : {}),
    };
}
function rawPayloadForEvent(method, params, message) {
    if (method === "account/rateLimits/updated") {
        return {
            ...(message.id !== undefined ? { id: message.id } : {}),
            method,
            params: quotaUpdatedPayload(params),
        };
    }
    return jsonRecord(message);
}
function eventPayload(method, params, requestId) {
    if (method === "turn/diff/updated" && typeof params.diff === "string") {
        return {
            diff: params.diff,
            filesChanged: countChangedFiles(params.diff),
        };
    }
    if (method && isApprovalRequestMethod(method) && requestId !== undefined) {
        return {
            ...params,
            requestId: requestIdValue(params.requestId) ?? requestId,
        };
    }
    if (method === "item/completed" && itemType(params) === "agentMessage") {
        return agentMessageCompletedPayload(params);
    }
    if (method === "account/rateLimits/updated") {
        return quotaUpdatedPayload(params);
    }
    return params;
}
function quotaUpdatedPayload(params) {
    return {
        ...(isJsonRecord(params.rateLimits) ? { rateLimits: sanitizeRateLimits(params.rateLimits) } : {}),
        ...(isJsonRecord(params.rateLimitsByLimitId)
            ? { rateLimitsByLimitId: sanitizeRateLimitsByLimitId(params.rateLimitsByLimitId) }
            : {}),
    };
}
function sanitizeRateLimitsByLimitId(value) {
    const record = isJsonRecord(value) ? value : {};
    const result = {};
    for (const [limitId, item] of Object.entries(record)) {
        if (isJsonRecord(item)) {
            result[limitId] = sanitizeRateLimits(item);
        }
    }
    return result;
}
function sanitizeRateLimits(value) {
    const record = isJsonRecord(value) ? value : {};
    const primary = isJsonRecord(record.primary) ? record.primary : {};
    const secondary = isJsonRecord(record.secondary) ? record.secondary : null;
    const sanitized = {
        ...(typeof record.limitId === "string" ? { limitId: record.limitId } : {}),
        ...(typeof record.limitName === "string" ? { limitName: record.limitName } : {}),
        primary: sanitizeQuotaWindow(primary),
        ...(secondary ? { secondary: sanitizeQuotaWindow(secondary) } : {}),
        ...(typeof record.rateLimitReachedType === "string" ? { rateLimitReachedType: record.rateLimitReachedType } : {}),
        ...(typeof record.planType === "string" ? { planType: record.planType } : {}),
        ...(isJsonRecord(record.credits) ? { credits: record.credits } : {}),
    };
    return sanitized;
}
function sanitizeQuotaWindow(value) {
    return {
        ...(typeof value.usedPercent === "number" ? { usedPercent: value.usedPercent } : {}),
        ...(typeof value.windowDurationMins === "number" ? { windowDurationMins: value.windowDurationMins } : {}),
        ...(typeof value.resetsAt === "number" || typeof value.resetsAt === "string" ? { resetsAt: value.resetsAt } : {}),
        ...(typeof value.planType === "string" ? { planType: value.planType } : {}),
    };
}
function agentMessageCompletedPayload(params) {
    const item = jsonRecord(params.item);
    const threadId = stringValue(params.threadId);
    const turnId = stringValue(params.turnId);
    const itemId = stringValue(params.itemId) ?? stringValue(item.id);
    const text = textValue(item.text) ?? textValue(params.text);
    return {
        ...(threadId ? { threadId } : {}),
        ...(turnId ? { turnId } : {}),
        ...(itemId ? { itemId } : {}),
        itemType: "agentMessage",
        ...(text !== null ? { text } : {}),
    };
}
function countChangedFiles(diff) {
    return diff.split("\n").filter((line) => line.startsWith("diff --git ")).length;
}
function isApprovalRequestMethod(method) {
    return (method === "item/commandExecution/requestApproval" ||
        method === "item/fileChange/requestApproval" ||
        method === "item/permissions/requestApproval" ||
        method === "item/tool/requestUserInput");
}
function requestIdValue(value) {
    if (typeof value === "string" && value.length > 0) {
        return value;
    }
    return typeof value === "number" ? value : null;
}
function textValue(value) {
    return typeof value === "string" ? value : null;
}
function isJsonRecord(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
