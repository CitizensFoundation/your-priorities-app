import type { WorkflowStore, WorkflowTransaction } from "../store.js";
export class MemoryWorkflowStore implements WorkflowStore {
  private states = new Map<number, YpWorkflowState>();
  private documents = new Map<number, Map<string, unknown>>();
  private history = new Map<number, YpWorkflowEvent[]>();
  private locks = new Map<number, Promise<void>>();
  async create(state: YpWorkflowState) {
    if (this.states.has(state.groupId)) throw new Error("Duplicate workspace");
    this.states.set(state.groupId, structuredClone(state));
    this.documents.set(state.groupId, new Map());
    this.history.set(state.groupId, []);
  }
  async groups() {
    return [...this.states.keys()];
  }
  async transact<T>(
    groupId: number,
    work: (tx: WorkflowTransaction) => Promise<T>,
  ): Promise<T> {
    const previous = this.locks.get(groupId) ?? Promise.resolve();
    let release!: () => void;
    const next = new Promise<void>((resolve) => {
      release = resolve;
    });
    this.locks.set(
      groupId,
      previous.then(() => next),
    );
    await previous;
    try {
      const initial = this.states.get(groupId);
      if (!initial) throw new Error("Missing workspace");
      const state = structuredClone(initial),
        documents = structuredClone(this.documents.get(groupId)!),
        history = structuredClone(this.history.get(groupId)!);
      const tx: WorkflowTransaction = {
        state,
        get: async <T>(kind: string, id: string) =>
          documents.get(`${kind}:${id}`) as T | undefined,
        put: async (kind, id, data) => {
          documents.set(`${kind}:${id}`, structuredClone(data));
        },
        remove: async (kind, id) => {
          documents.delete(`${kind}:${id}`);
        },
        list: async <T>(kind: string) =>
          [...documents]
            .filter(([key]) => key.startsWith(`${kind}:`))
            .map(([, v]) => v as T),
        emit: async (type, data, key) => {
          key ??= `api:${state.nextEvent + 1}`;
          if (history.some((e) => e.key === key)) return;
          history.push({
            seq: ++state.nextEvent,
            type,
            data,
            key,
            at: new Date().toISOString(),
          });
        },
      };
      const result = await work(tx);
      this.states.set(groupId, structuredClone(state));
      this.documents.set(groupId, structuredClone(documents));
      this.history.set(groupId, history);
      return structuredClone(result);
    } finally {
      release();
    }
  }
  async events(groupId: number, after: number, limit = 200) {
    return structuredClone(
      (this.history.get(groupId) ?? [])
        .filter((e) => e.seq > after)
        .slice(0, limit),
    );
  }
}
export const hostId = "55555555-5555-4555-8555-555555555555";
export const runId = "33333333-3333-4333-8333-333333333333";
export function workspace(groupId = 1): YpWorkflowState {
  return {
    id: "44444444-4444-4444-8444-444444444444",
    groupId,
    config: {
      packageId: "skills-first",
      hostId,
      codexModel: "test-codex",
      codexReasoningEffort: "max",
      operatorIds: [10],
      budgetMicros: 10_000_000_000,
      trialBudgetMicros: 5_000_000,
      quotaBytes: 10 * 1024 ** 3,
      concurrency: 2,
    },
    revision: 1,
    graph: {
      nodes: [
        {
          id: "analyze",
          kind: "agent",
          label: "Analysis",
          entrypoint: "source/analysis.ts",
          enabled: true,
          models: { default: "test-model" },
          configuration: {},
          position: { x: 0, y: 0 },
        },
      ],
      edges: [],
    },
    operator: { userId: 10, generation: 1 },
    sessionId: null,
    activeRunId: null,
    spentMicros: 0,
    reservedMicros: 0,
    trialSpentMicros: 0,
    trialReservedMicros: 0,
    storedBytes: 0,
    uploadReservedBytes: 0,
    nextEvent: 0,
  };
}
export function run(state = workspace()): YpWorkflowRun {
  return {
    id: runId,
    ownerId: 10,
    mode: "bulk",
    status: "running",
    revision: 1,
    sourceHash: "source",
    fingerprint: "fingerprint",
    graph: state.graph,
    nodeIds: ["analyze"],
    assetIds: [],
    inputCount: 10000,
    budgetMicros: 5_000_000_000,
    spentMicros: 0,
    reservedMicros: 0,
    nodeStates: {},
    createdAt: new Date().toISOString(),
  };
}
export async function fixture() {
  const store = new MemoryWorkflowStore(),
    state = workspace(),
    record = run(state);
  await store.create(state);
  await store.transact(1, (tx) => tx.put("run", record.id, record));
  return { store, state, run: record };
}
