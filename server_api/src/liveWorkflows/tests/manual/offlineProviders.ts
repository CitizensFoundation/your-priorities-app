import { randomUUID } from "node:crypto";
import type {
  CodexAppServerTransport,
  JsonRpcMessage,
} from "../../vm/codex/appServerTransport.js";
import type { ProviderReply } from "../../modelGateway.js";

/** Rehearsal only. Unknown methods fail rather than accidentally reaching a provider. */
export class OfflineCodexTransport implements CodexAppServerTransport {
  constructor(private readonly scriptedTurn?: () => Promise<string>) {}
  private listeners: ((message: JsonRpcMessage) => void)[] = [];
  private threadId = randomUUID();
  private turns = 0;
  private timer?: ReturnType<typeof setTimeout>;
  async request(method: string): Promise<unknown> {
    if (
      [
        "initialize",
        "account/login/start",
        "thread/archive",
        "turn/interrupt",
      ].includes(method)
    )
      return {};
    if (method === "account/read") return { account: { type: "apiKey" } };
    if (method === "thread/start") return { thread: { id: this.threadId } };
    if (method === "model/list")
      return {
        data: [{ id: "offline-codex", displayName: "Offline fixture" }],
      };
    if (method === "turn/start") {
      const turns = ++this.turns;
      const turnId = randomUUID();
      this.timer = setTimeout(() => {
        void (async () => {
          let text =
            "Hello! Ready for your Skills First job descriptions. (Offline fixture.)";
          try {
            if (this.scriptedTurn) text = await this.scriptedTurn();
          } catch (error) {
            for (const listener of this.listeners)
              listener({
                method: "error",
                params: {
                  threadId: this.threadId,
                  turnId,
                  error: { message: String(error) },
                },
              });
            return;
          }
          for (const message of [
            {
              method: "turn/started",
              params: { threadId: this.threadId, turn: { id: turnId } },
            },
            {
              method: "item/completed",
              params: {
                threadId: this.threadId,
                turnId,
                item: {
                  id: randomUUID(),
                  type: "agentMessage",
                  text,
                },
              },
            },
            {
              method: "thread/tokenUsage/updated",
              params: {
                threadId: this.threadId,
                turnId,
                tokenUsage: {
                  last: {
                    inputTokens: 1000,
                    cachedInputTokens: 200,
                    cacheWriteInputTokens: 100,
                    outputTokens: 100,
                    reasoningOutputTokens: 80,
                    totalTokens: 1100,
                  },
                  total: {
                    inputTokens: 1000 * turns,
                    cachedInputTokens: 200 * turns,
                    cacheWriteInputTokens: 100 * turns,
                    outputTokens: 100 * turns,
                    reasoningOutputTokens: 80 * turns,
                    totalTokens: 1100 * turns,
                  },
                },
              },
            },
            {
              method: "turn/completed",
              params: {
                threadId: this.threadId,
                turn: { id: turnId, status: "completed" },
              },
            },
          ])
            for (const listener of this.listeners) listener(message);
        })();
      }, 100);
      return { turn: { id: turnId } };
    }
    throw new Error(`Unimplemented offline Codex method: ${method}`);
  }
  notify() {}
  onNotification(listener: (message: JsonRpcMessage) => void) {
    this.listeners.push(listener);
  }
  respondToServerRequest() {
    throw new Error("Offline approvals are not implemented");
  }
  rejectServerRequest() {}
  async close() {
    clearTimeout(this.timer);
    this.listeners = [];
  }
}

export async function offlineProcessing(
  _model: unknown,
  system: string,
  input: string,
): Promise<ProviderReply> {
  const record = JSON.parse(input);
  let content: unknown;
  if (system.includes("isMultiLevel")) {
    const text = String(record.job.text);
    const first = text.indexOf("Records Technician I:"),
      second = text.indexOf("Records Technician II:");
    content =
      first >= 0 && second > first
        ? {
            isMultiLevel: true,
            sharedQuotes: [text.slice(0, first).trim()],
            levels: [
              {
                name: "Records Technician I",
                evidenceQuotes: [text.slice(first, second).trim()],
              },
              {
                name: "Records Technician II",
                evidenceQuotes: [text.slice(second).trim()],
              },
            ],
          }
        : { isMultiLevel: false, sharedQuotes: [], levels: [] };
  } else if (system.includes("allLevelsCovered"))
    content = {
      allLevelsCovered: true,
      sharedRequirementsPreserved: true,
      noCrossLevelRequirements: true,
      issues: [],
    };
  else if (system.includes("allChecksPassed"))
    content = {
      allChecksPassed: true,
      checks: [
        "dutyPreservation",
        "legalRequirements",
        "inclusiveLanguage",
        "readability",
        "factualAccuracy",
      ].map((name) => ({ name, passed: true, reason: "Offline fixture" })),
    };
  else if (system.includes("findings")) {
    const missing = String(record.text).includes("does not state education");
    content = {
      status: missing ? "unknown" : "known",
      findings: system.includes("Task: Determine whether degrees")
        ? {
            isDegreeMandatory: missing
              ? null
              : /degree in .+ is required/.test(record.text),
            hasAlternativeQualifications: missing
              ? null
              : record.text.includes("instead of a degree"),
          }
        : system.includes("Task: Identify explicit professional license")
          ? {
              isLicenseRequired: null,
            }
          : { note: "Offline fixture; no semantic evaluation" },
      evidence: missing ? [] : [record.text],
    };
  } else if (system.includes("changes") && system.includes("text"))
    content = { text: record.text, changes: [] };
  else throw new Error("Unrecognized offline processing prompt");
  return {
    content: JSON.stringify(content),
    tokensIn: 100,
    tokensOut: 100,
  };
}
