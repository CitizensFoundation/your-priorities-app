/// <reference path="./skillsFirst.d.ts" />
/** Shared Live Workflows API types. Currency is integer millionths of one USD. */
interface YpPostRevision {
  id: number;
  post_id: number;
  user_id: number;
  name: string;
  description: string;
}
type YpWorkflowJson =
  | null
  | boolean
  | number
  | string
  | YpWorkflowJson[]
  | { [key: string]: YpWorkflowJson };
type YpWorkflowStatus =
  | "draft"
  | "trial"
  | "awaiting_approval"
  | "queued"
  | "running"
  | "paused"
  | "completed"
  | "failed"
  | "cancelled";
type YpWorkflowReasoningEffort = "low" | "medium" | "high" | "xhigh" | "max";
type YpWorkflowCodexReasoningEffort =
  | YpWorkflowReasoningEffort
  | "none"
  | "minimal";
interface YpWorkflowAssistantSettings {
  model: string;
  reasoningEffort: YpWorkflowCodexReasoningEffort;
  serviceTier: "regular" | "fast";
}
interface YpWorkflowCodexModel {
  id: string;
  model?: string;
  displayName?: string;
  defaultReasoningEffort?: YpWorkflowCodexReasoningEffort;
  supportedReasoningEfforts?: {
    reasoningEffort: YpWorkflowCodexReasoningEffort;
    description: string;
  }[];
}
interface YpWorkflowNode {
  id: string;
  kind: "agent" | "connector" | "artifact";
  label: string;
  description?: string;
  entrypoint?: string;
  enabled: boolean;
  models: Record<string, string>;
  reasoningEffort?: YpWorkflowReasoningEffort;
  configuration: Record<string, YpWorkflowJson>;
  position: { x: number; y: number };
  budgetMicros?: number;
}
interface YpWorkflowGraph {
  nodes: YpWorkflowNode[];
  edges: { id: string; source: string; target: string; label?: string }[];
}
interface YpWorkflowConfiguration {
  packageId: string;
  hostId: string;
  codexModel: string;
  codexReasoningEffort: YpWorkflowCodexReasoningEffort;
  /** Older saved workspaces default to the standard tier. */
  codexServiceTier?: YpWorkflowAssistantSettings["serviceTier"];
  operatorIds: number[];
  budgetMicros: number;
  trialBudgetMicros: number;
  quotaBytes: number;
  concurrency: number;
}
interface YpWorkflowModelDefaults {
  codexModel: string;
  processingModel: string;
  codexReasoningEffort: YpWorkflowReasoningEffort;
  processingReasoningEffort: YpWorkflowReasoningEffort;
}
interface YpWorkflowState {
  id: string;
  groupId: number;
  config: YpWorkflowConfiguration;
  revision: number;
  graph: YpWorkflowGraph;
  operator: { userId: number; generation: number } | null;
  sessionId: string | null;
  activeRunId: string | null;
  spentMicros: number;
  reservedMicros: number;
  trialSpentMicros: number;
  trialReservedMicros: number;
  storedBytes: number;
  uploadReservedBytes: number;
  nextEvent: number;
}
interface YpWorkflowEvent {
  seq: number;
  key: string;
  type: string;
  at: string;
  data: Record<string, YpWorkflowJson>;
}
interface YpWorkflowAsset {
  id: string;
  name: string;
  version: number;
  checksum: string;
  bytes: number;
  contentType: string;
  source: "upload" | "connector" | "artifact";
  createdAt: string;
  resultSet?: {
    runId: string;
    nodeId: string;
    part: number;
    count: number;
  };
}
interface YpWorkflowResultPage {
  rows: {
    key: string;
    value: Record<string, YpWorkflowJson>;
    comparison?: Record<string, YpWorkflowJson>;
  }[];
  total: number;
  offset: number;
  limit: number;
  available: boolean;
  comparisonAvailable: boolean;
}
interface YpWorkflowSample {
  recordIds: string[];
  populationCount: number;
  populationLengthRange: number[];
  sampleLengthRange: number[];
}
interface YpWorkflowEstimate {
  fingerprint: string;
  trialRunId: string;
  sampleCount: number;
  populationCount: number;
  expectedMicros: number;
  upperMicros: number;
  notes: string[];
  evidence?: {
    coverage: number;
    attributedCostFraction: number;
    minRecordMicros: number;
    maxRecordMicros: number;
    standardDeviationMicros: number;
    recommendedSampleCount: number;
    needsMoreEvidence: boolean;
  };
  agents?: {
    nodeId: string;
    sampleMicros: number;
    expectedMicros: number;
    upperMicros: number;
  }[];
}
interface YpWorkflowNodeCost {
  spentMicros: number;
  reservedMicros: number;
  requests: number;
}
interface YpWorkflowAgentMessage {
  nodeId: string;
  message: string;
  at: string;
}
interface YpWorkflowRun {
  id: string;
  mode: "trial" | "bulk";
  status: YpWorkflowStatus;
  ownerId: number;
  revision: number;
  sourceHash: string;
  fingerprint: string;
  graph: YpWorkflowGraph;
  nodeIds: string[];
  /** Frozen catalog entries for models selected by this run's processing agents. */
  modelCatalog?: YpWorkflowModel[];
  assetIds: string[];
  targetNodeId?: string;
  nodeCosts?: Record<string, YpWorkflowNodeCost>;
  nodeBudgets?: Record<string, number>;
  inputCount: number;
  concurrency?: number;
  runtimeImage?: string;
  executionId?: string;
  budgetMicros: number;
  spentMicros: number;
  reservedMicros: number;
  nodeStates: Record<
    string,
    {
      status: YpWorkflowStatus;
      processed: number;
      total: number;
      failedRecords?: number;
      outputCount?: number;
      message?: string;
      updatedAt?: string;
    }
  >;
  /** The 50 most recent agent messages, in delivery order. */
  agentMessages?: YpWorkflowAgentMessage[];
  childStates?: Record<
    string,
    { nodeId: string; label: string; processed: number; total: number }
  >;
  edgeStates?: Record<string, { records: number; at: string }>;
  estimate?: YpWorkflowEstimate;
  sample?: YpWorkflowSample;
  recordCosts?: Record<string, number>;
  forecast?: {
    remainingMicros: number;
    totalMicros: number;
    exceedsAllowance: boolean;
    basis: string;
  };
  createdAt: string;
  approvedAt?: string;
  completedAt?: string;
  error?: string;
}
interface YpWorkflowModel {
  id: string;
  label: string;
  provider: "openai" | "anthropic" | "google";
  reasoning?: boolean;
  reasoningEffort?: YpWorkflowReasoningEffort;
  inferenceType?: "priority";
  standardPrices?: Pick<
    YpWorkflowModel,
    | "inputMicrosPerMillion"
    | "outputMicrosPerMillion"
    | "cachedInputMicrosPerMillion"
    | "cacheWriteInputMicrosPerMillion"
  >;
  inputMicrosPerMillion: number;
  outputMicrosPerMillion: number;
  cachedInputMicrosPerMillion?: number;
  cacheWriteInputMicrosPerMillion?: number;
  maxOutputTokens: number;
  contextTokens: number;
  priceVersion: string;
}
interface YpWorkflowConnector {
  id: string;
  label: string;
  kind:
    | "your-priorities"
    | "google-sheets"
    | "google-docs"
    | "google-drive"
    | "firecrawl";
  resourceId: string;
  writeEnabled: boolean;
  settings: Record<string, YpWorkflowJson>;
}
interface YpWorkflowSnapshot {
  workspace: YpWorkflowState;
  assistantName?: string;
  assets: YpWorkflowAsset[];
  runs: YpWorkflowRun[];
  connectors: YpWorkflowConnector[];
  connectionProposals?: YpWorkflowConnectionProposal[];
  models: YpWorkflowModel[];
  hosts: { id: string; name: string; connected: boolean }[];
  permissions: { userId: number; admin: boolean; operate: boolean };
  chatgptConnected: boolean;
  codexAuthMode: "chatgpt" | "api-key" | null;
  modelRoles?: string[];
  assistantSession?: {
    active: boolean;
    /** Settings requested when the current/last turn started, not next-turn defaults. */
    turnSettings?: YpWorkflowAssistantSettings;
  };
}
interface YpWorkflowRevision {
  hash: string;
  at: string;
  version: string;
  agents: number;
}
interface YpWorkflowConnectionProposal {
  id: string;
  binding: YpWorkflowConnector;
  purpose: string;
  baseBindingHash: string | null;
  proposedBy: number;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
  decidedBy?: number;
  decidedAt?: string;
}
