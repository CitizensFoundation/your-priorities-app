export class MemoryWorkflowStore {
    constructor() {
        this.states = new Map();
        this.documents = new Map();
        this.history = new Map();
        this.locks = new Map();
    }
    async create(state) {
        if (this.states.has(state.groupId))
            throw new Error("Duplicate workspace");
        this.states.set(state.groupId, structuredClone(state));
        this.documents.set(state.groupId, new Map());
        this.history.set(state.groupId, []);
    }
    async groups() {
        return [...this.states.keys()];
    }
    async transact(groupId, work) {
        const previous = this.locks.get(groupId) ?? Promise.resolve();
        let release;
        const next = new Promise((resolve) => {
            release = resolve;
        });
        this.locks.set(groupId, previous.then(() => next));
        await previous;
        try {
            const initial = this.states.get(groupId);
            if (!initial)
                throw new Error("Missing workspace");
            const state = structuredClone(initial), documents = structuredClone(this.documents.get(groupId)), history = structuredClone(this.history.get(groupId));
            const tx = {
                state,
                get: async (kind, id) => documents.get(`${kind}:${id}`),
                put: async (kind, id, data) => {
                    documents.set(`${kind}:${id}`, structuredClone(data));
                },
                remove: async (kind, id) => {
                    documents.delete(`${kind}:${id}`);
                },
                list: async (kind) => [...documents]
                    .filter(([key]) => key.startsWith(`${kind}:`))
                    .map(([, v]) => v),
                emit: async (type, data, key) => {
                    key ?? (key = `api:${state.nextEvent + 1}`);
                    if (history.some((e) => e.key === key))
                        return;
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
        }
        finally {
            release();
        }
    }
    async events(groupId, after, limit = 200) {
        return structuredClone((this.history.get(groupId) ?? [])
            .filter((e) => e.seq > after)
            .slice(0, limit));
    }
}
export const hostId = "55555555-5555-4555-8555-555555555555";
export const runId = "33333333-3333-4333-8333-333333333333";
export function workspace(groupId = 1) {
    return {
        id: "44444444-4444-4444-8444-444444444444",
        groupId,
        config: {
            packageId: "skills-first",
            hostId,
            codexModel: "test-codex",
            codexReasoningEffort: "max",
            operatorIds: [10],
            budgetMicros: 10000000000,
            trialBudgetMicros: 5000000,
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
export function run(state = workspace()) {
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
        budgetMicros: 5000000000,
        spentMicros: 0,
        reservedMicros: 0,
        nodeStates: {},
        createdAt: new Date().toISOString(),
    };
}
export async function fixture() {
    const store = new MemoryWorkflowStore(), state = workspace(), record = run(state);
    await store.create(state);
    await store.transact(1, (tx) => tx.put("run", record.id, record));
    return { store, state, run: record };
}
