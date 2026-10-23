import { VmBrokerRegistry } from "./services/vmBrokerRegistry.js";
import type { WorkflowStore, WorkflowTransaction } from "./store.js";
import { HostDirectory, SecretBox } from "./secrets.js";
import { type PackageSnapshot } from "./packages.js";
import type { ModelGateway } from "./modelGateway.js";
import type { ConnectorService } from "./connectors.js";
import { type VmCommand, type VmSessionEventPayload, type VmCodexAuthMaterialUpdatedPayload } from "./contracts/index.js";
export interface WorkflowActor {
    userId: number;
    admin: boolean;
}
interface Session {
    id: string;
    ownerId: number;
    threadId?: string;
    turnId?: string;
    active: boolean;
    status: "starting" | "ready" | "closed" | "error";
    streamId?: string;
    sourceSeq?: number;
    startedAt?: number;
    turnSettings?: YpWorkflowAssistantSettings;
}
export declare class WorkflowService {
    readonly store: WorkflowStore;
    readonly broker: VmBrokerRegistry;
    readonly hosts: HostDirectory;
    readonly secrets: SecretBox;
    readonly models: ModelGateway;
    readonly connectors: ConnectorService;
    readonly workspaceGroups: Map<string, number>;
    constructor(store: WorkflowStore, broker: VmBrokerRegistry, hosts: HostDirectory, secrets: SecretBox, models: ModelGateway, connectors: ConnectorService);
    initialize(): Promise<void>;
    hostRestarted(hostId: string): Promise<void>;
    requireOperator(tx: WorkflowTransaction, actor: WorkflowActor): void;
    root(state: YpWorkflowState): string;
    command(hostId: string, messageType: VmCommand, data: Record<string, unknown>, timeoutMs?: number): Promise<unknown>;
    create(groupId: number, actor: WorkflowActor, configuration: unknown): Promise<YpWorkflowState>;
    prepare(groupId: number): Promise<void>;
    snapshot(groupId: number, actor: WorkflowActor): Promise<YpWorkflowSnapshot>;
    proposeConnection(groupId: number, actor: WorkflowActor, value: unknown): Promise<YpWorkflowConnectionProposal>;
    connectionProposal(groupId: number, actor: WorkflowActor, id: string): Promise<YpWorkflowConnectionProposal>;
    rejectConnection(groupId: number, actor: WorkflowActor, id: string): Promise<void>;
    configure(groupId: number, actor: WorkflowActor, value: unknown): Promise<void>;
    updateAssistantSettings(groupId: number, actor: WorkflowActor, value: unknown): Promise<{
        model: string;
        reasoningEffort: "max" | "high" | "medium" | "low" | "xhigh" | "none" | "minimal";
        serviceTier: "fast" | "regular";
    }>;
    claim(groupId: number, actor: WorkflowActor, takeover: boolean): Promise<void>;
    login(groupId: number, actor: WorkflowActor): Promise<{
        verificationUrl: string;
        userCode: string;
    }>;
    completeLogin(groupId: number, actor: WorkflowActor): Promise<{
        connected: boolean;
    }>;
    connectApiKey(groupId: number, actor: WorkflowActor, input: unknown): Promise<{
        connected: boolean;
    }>;
    disconnect(groupId: number, actor: WorkflowActor): Promise<void>;
    private clearAccountOperation;
    ensureSession(groupId: number, actor: WorkflowActor): Promise<Session>;
    chat(groupId: number, actor: WorkflowActor, text: string, steer: boolean): Promise<unknown>;
    sessionControl(groupId: number, actor: WorkflowActor, operation: "interrupt" | "approval" | "terminate", data: Record<string, unknown>): Promise<unknown>;
    codexModels(groupId: number, actor: WorkflowActor): Promise<unknown>;
    ingestSession(hostId: string, event: VmSessionEventPayload): Promise<void>;
    ingestAuth(hostId: string, payload: VmCodexAuthMaterialUpdatedPayload): Promise<void>;
    updateGraph(groupId: number, actor: WorkflowActor, graph: unknown, revision: number): Promise<void>;
    packageSnapshot(groupId: number): Promise<PackageSnapshot>;
    revisions(groupId: number): Promise<{
        currentHash: string | undefined;
        revisions: YpWorkflowRevision[];
    }>;
    revision(groupId: number, hash: string): Promise<{
        hash: string;
        files: Record<string, string>;
    }>;
    restoreRevision(groupId: number, actor: WorkflowActor, hash: string, revision: number): Promise<{
        hash: string;
        backup: string;
    }>;
    storage(groupId: number, actor: WorkflowActor, prune?: boolean): Promise<{
        eligibleRuns: number;
        removed: number;
        availableBytes: number;
        minimumFreeBytes: number;
    }>;
    draftRun(groupId: number, actor: WorkflowActor, mode: "trial" | "bulk", assetIds: string[], sampleCount?: number, targetNodeId?: string, reuse?: {
        runId: string;
        fromNodeId: string;
    }): Promise<YpWorkflowRun>;
    startRun(groupId: number, actor: WorkflowActor, id: string, approvedBudget?: number): Promise<void>;
    controlRun(groupId: number, actor: WorkflowActor, id: string, operation: "pause" | "resume" | "cancel", approvedBudget?: number, approvedNodeBudgets?: Record<string, number>, approvedRecordBudgets?: Record<string, number>): Promise<void>;
    runnerEvent(groupId: number, hostId: string, runId: string, type: string, data: Record<string, YpWorkflowJson>, key: string): Promise<void>;
}
export {};
