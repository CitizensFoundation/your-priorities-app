import { z } from "zod";
import { type ISODateTime, type Json, type ScopeRef, type UUID } from "./core.js";
import { type VmHost } from "./execution.js";
export declare const WorkflowNodeKinds: readonly ["noop", "codex_session", "human_review", "literature_sweep", "signal_rank", "hypothesis_generate", "analysis_extract", "dynamic_paper_patch", "evolution_round", "brief_generate", "artifact_publish"];
export type WorkflowNodeKind = (typeof WorkflowNodeKinds)[number];
export declare const ScienceNodeRunnerKinds: readonly ["policy_synth_task", "policy_synth_waterfall", "single_model_task", "external_job"];
export type ScienceNodeRunnerKind = (typeof ScienceNodeRunnerKinds)[number];
export interface WorkflowNodeDefinition {
    id: UUID;
    kind: WorkflowNodeKind;
    name: string;
    config: Record<string, Json>;
    dependsOn?: UUID[];
    runtimeProfileId?: UUID | null;
    authProfileId?: UUID | null;
}
export interface WorkflowGraphDefinition {
    version: 1;
    nodes: WorkflowNodeDefinition[];
}
export interface WorkflowStepJobData {
    runId: UUID;
    runStepId: UUID;
    nodeId: UUID;
    attempt: number;
}
export type WorkflowNormalizedErrorPayload = Record<string, Json> & {
    code: string;
};
export type NoopWorkflowStepOutputPayload = {
    executor: "noop";
    runId: UUID;
    runStepId: UUID;
    nodeId: UUID;
    attempt: number;
};
export type CodexSessionWorkflowStepOutputPayload = {
    executor: "codex_session";
    sessionId: UUID;
    workspaceId: UUID;
    vmHostId: UUID;
    runtimeProfileId: UUID;
    authProfileId?: UUID | null;
    datasetMounts?: Record<string, Json>[];
    previousArtifactMounts?: Record<string, Json>[];
    brokerCommand: Record<string, Json>;
} | {
    executor: "codex_session";
    sessionId: UUID;
    terminalSessionStatus: "completed";
};
export type HumanReviewWorkflowStepOutputPayload = {
    executor: "human_review";
    reviewCaseId: UUID;
    reviewBoardGroupId: number;
    priority: string;
    scope: ScopeRef;
} | {
    executor: "human_review";
    reviewCaseId: UUID;
    terminalReviewCaseStatus: "resolved";
};
export type ScienceNodeWorkflowStepOutputPayload = {
    executor: "science_node_runner";
    nodeKind: WorkflowNodeKind;
    scienceAgentRunId: UUID;
    runnerKind: ScienceNodeRunnerKind | string;
    provider: string;
    model: string;
    dispatch: Record<string, Json> | null;
} | {
    executor: "science_node_runner";
    nodeKind: WorkflowNodeKind;
    scienceAgentRunId: UUID;
    runnerKind: ScienceNodeRunnerKind | string;
    terminalScienceAgentRunStatus: "completed";
    finalOutput: Record<string, Json>;
};
export type WorkflowStepOutputPayload = NoopWorkflowStepOutputPayload | CodexSessionWorkflowStepOutputPayload | HumanReviewWorkflowStepOutputPayload | ScienceNodeWorkflowStepOutputPayload;
export declare const WorkflowTemplateStatuses: readonly ["draft", "active", "archived"];
export type WorkflowTemplateStatus = (typeof WorkflowTemplateStatuses)[number];
export interface WorkflowTemplate {
    id: UUID;
    scope: ScopeRef;
    name: string;
    description?: string | null;
    status: WorkflowTemplateStatus | string;
    metadata: Record<string, Json>;
    createdAt: ISODateTime;
    updatedAt: ISODateTime;
}
export declare const WorkflowTemplateRevisionStatuses: readonly ["draft", "published", "archived"];
export type WorkflowTemplateRevisionStatus = (typeof WorkflowTemplateRevisionStatuses)[number];
export interface WorkflowTemplateRevision {
    id: UUID;
    workflowTemplateId: UUID;
    revisionNo: number;
    definition: Record<string, Json>;
    status: WorkflowTemplateRevisionStatus | string;
    createdByUserId?: number | null;
    createdAt: ISODateTime;
    updatedAt: ISODateTime;
}
export declare const PromptBindingTargetKinds: readonly ["chief_scientist_review", "chief_scientist_reasoning_effort", "morning_brief", "codex_agents_md", "codex_skill", "group_final_review_agents_md", "code_data_review", "group_final_review_reviewer", "group_final_review_reviewer_correction", "group_final_review_preprint_draft", "group_final_review_preprint_draft_correction", "group_final_review_preprint_revision", "group_final_review_preprint_revision_correction", "group_final_review_council_member_system", "group_final_review_council_chair_system", "group_final_review_distill_correction", "group_final_review_lay_summary_correction", "experiment_plan_generator", "experiment_group_plan_generator_system", "experiment_group_plan_simple_review", "serial_experiment_planning_policy", "experiment_full_plan_template", "experiment_agents_md_template", "experiment_dataset_agents_md_template", "experiment_github_agents_md_injection", "experiment_research_plan_template", "experiment_initial_research_step_instruction", "paper_draft", "paper_review", "preprint_planner_review", "preprint_council", "chief_human_review_options", "paper_distill", "paper_lay_summary", "paper_patch", "literature_sweep", "signal_rank", "hypothesis_generate", "analysis_extract", "brief_generate", "dynamic_paper_patch", "evolution_round", "group_continuation_extract", "group_continuation_synthesis", "ai_council_draft", "ai_council_rank", "ai_council_synthesis", "ai_council_ratify", "ai_council_review", "ai_council_vote"];
export type PromptBindingTargetKind = (typeof PromptBindingTargetKinds)[number];
export interface PromptBinding {
    id: UUID;
    scope: ScopeRef;
    targetKind: PromptBindingTargetKind | string;
    postId: number;
    postRevisionId: number;
    priority: number;
    metadata: Record<string, Json>;
    createdAt: ISODateTime;
    updatedAt: ISODateTime;
}
export interface PromptTemplateResolution {
    targetKind: PromptBindingTargetKind | string;
    requestedScope: ScopeRef;
    resolvedScope: ScopeRef;
    bindingId: UUID;
    postId: number;
    postRevisionId: number;
    priority: number;
    name: string;
    content: string;
    checksumSha256: string;
    inherited: boolean;
    metadata: Record<string, Json>;
    createdAt: ISODateTime;
    updatedAt: ISODateTime;
}
export interface PromptTemplateReference {
    targetKind: PromptBindingTargetKind | string;
    requestedScope: ScopeRef;
    resolvedScope: ScopeRef;
    bindingId: UUID;
    postId: number;
    postRevisionId: number;
    checksumSha256: string;
    inherited: boolean;
}
export declare const AgentRuntimeKinds: readonly ["codex_app_server"];
export type AgentRuntimeKind = (typeof AgentRuntimeKinds)[number];
export declare const AgentRuntimeDockerNetworks: readonly ["provider", "none"];
export type AgentRuntimeDockerNetwork = (typeof AgentRuntimeDockerNetworks)[number];
export declare const AgentRuntimeDockerGpuModes: readonly ["all", "none"];
export type AgentRuntimeDockerGpuMode = (typeof AgentRuntimeDockerGpuModes)[number];
export interface AgentRuntimeDockerPolicy {
    network: AgentRuntimeDockerNetwork;
    gpus: AgentRuntimeDockerGpuMode;
    memoryBytes?: number;
    cpus?: number | string;
    pidsLimit: number;
    nofileSoft: number;
    nofileHard: number;
    readOnlyRootFilesystem: boolean;
}
export declare const DefaultAgentRuntimeDockerPolicy: {
    readonly network: "provider";
    readonly gpus: "none";
    readonly pidsLimit: 4096;
    readonly nofileSoft: 1024;
    readonly nofileHard: 4096;
    readonly readOnlyRootFilesystem: false;
};
export declare const ResearcherReasoningEfforts: readonly ["none", "minimal", "low", "medium", "high", "xhigh", "max"];
export type ResearcherReasoningEffort = (typeof ResearcherReasoningEfforts)[number];
/** @deprecated Use ResearcherReasoningEfforts. */
export declare const CodexReasoningEfforts: readonly ["none", "minimal", "low", "medium", "high", "xhigh", "max"];
/** @deprecated Use ResearcherReasoningEffort. */
export type CodexReasoningEffort = ResearcherReasoningEffort;
export declare const WorkflowReasoningEfforts: readonly ["low", "medium", "high", "xhigh", "max"];
export type WorkflowReasoningEffort = (typeof WorkflowReasoningEfforts)[number];
export declare const DynamicResearcherReasoningEfforts: readonly ["medium", "high", "xhigh", "max"];
export type DynamicResearcherReasoningEffort = (typeof DynamicResearcherReasoningEfforts)[number];
/** @deprecated Use DynamicResearcherReasoningEfforts. */
export declare const DynamicCodexReasoningEfforts: readonly ["medium", "high", "xhigh", "max"];
/** @deprecated Use DynamicResearcherReasoningEffort. */
export type DynamicCodexReasoningEffort = DynamicResearcherReasoningEffort;
export declare const ResearcherServiceTiers: readonly ["regular", "fast", "flex"];
export type ResearcherServiceTier = (typeof ResearcherServiceTiers)[number];
/** @deprecated Use ResearcherServiceTiers. */
export declare const CodexServiceTiers: readonly ["regular", "fast", "flex"];
/** @deprecated Use ResearcherServiceTier. */
export type CodexServiceTier = ResearcherServiceTier;
export declare const ModelInferenceTypes: readonly ["normal", "flex", "priority"];
export type ModelInferenceType = (typeof ModelInferenceTypes)[number];
export declare const ProviderInferenceTypes: readonly ["fast", "flex", "priority"];
export type ProviderInferenceType = (typeof ProviderInferenceTypes)[number];
export declare const ModelDefaultLanes: readonly ["workflow", "researcher"];
export type ModelDefaultLane = (typeof ModelDefaultLanes)[number];
export declare const PolicySynthModelSurfaces: readonly ["project_creation", "paper_generation", "paper_distill", "paper_lay_summary", "preprint_planner_review", "chief_human_review_options", "chief_scientist_review", "agent_step", "literature_sweep", "signal_rank", "hypothesis_generate", "analysis_extract", "brief_generate", "dynamic_paper_patch", "evolution_round", "group_continuation_extract", "group_continuation_synthesis", "ai_council_draft", "ai_council_rank", "ai_council_synthesis", "ai_council_ratify", "ai_council_review", "ai_council_vote"];
export type PolicySynthModelSurface = (typeof PolicySynthModelSurfaces)[number];
export declare const AiCouncilSurfaces: readonly ["ai_council_draft", "ai_council_rank", "ai_council_synthesis", "ai_council_ratify", "group_continuation_synthesis"];
export type AiCouncilSurface = (typeof AiCouncilSurfaces)[number];
export declare const AiCouncilChairSurfaces: readonly ["ai_council_synthesis", "group_continuation_synthesis"];
export type AiCouncilChairSurface = (typeof AiCouncilChairSurfaces)[number];
export declare const ModelAssignmentIds: readonly ["planning.experiment", "review.preprint", "review.chief", "review.code_data", "paper.generate", "paper.distill", "paper.lay_summary", "paper.dynamic_patch", "preprint.synthesis", "agent.step", "research.literature_sweep", "research.signal_rank", "research.hypothesis_generate", "research.analysis_extract", "research.brief_generate", "evolution.round", "continuation.extract", "continuation.synthesis", "council.draft", "council.rank", "council.synthesis", "council.ratify", "infographic.design"];
export type ModelAssignmentId = (typeof ModelAssignmentIds)[number];
export declare const LegacyModelSurfaceAssignments: Readonly<Record<string, ModelAssignmentId>>;
export declare const OpenAiReasoningModes: readonly ["standard", "pro"];
export type OpenAiReasoningMode = (typeof OpenAiReasoningModes)[number];
export interface OpenAiWorkflowModelOptions {
    reasoningMode?: OpenAiReasoningMode | null;
}
export interface WorkflowModelProviderOptions {
    openai?: OpenAiWorkflowModelOptions;
    anthropic?: Record<string, Json>;
    google?: Record<string, Json>;
    [provider: string]: Record<string, Json> | OpenAiWorkflowModelOptions | undefined;
}
export interface WorkflowModelSelector {
    provider?: string;
    model?: string;
    apiModel?: string | null;
    inferenceType?: ModelInferenceType | string | null;
    reasoningEffort?: string | null;
    providerOptions?: WorkflowModelProviderOptions;
    metadata?: Record<string, Json>;
}
/** @deprecated Internal compatibility alias. New configuration uses WorkflowModelSelector. */
export type PolicySynthModelSelector = WorkflowModelSelector;
export interface WorkflowModelRosterMember {
    id: string;
    label?: string;
    selector: WorkflowModelSelector;
}
export interface WorkflowModelRoster {
    members: WorkflowModelRosterMember[];
}
export declare const AiCouncilRosterIds: readonly ["council.default", "council.preprint", "council.continuation"];
export type AiCouncilRosterId = (typeof AiCouncilRosterIds)[number];
export declare const MaxAiCouncilRosterSize = 7;
export interface ResearcherModelSelector {
    model?: string;
    reasoningEffort?: ResearcherReasoningEffort | string;
    serviceTier?: ResearcherServiceTier | string;
    dynamicReasoningEffort?: boolean;
    modelProvider?: string;
    metadata?: Record<string, Json>;
}
/** @deprecated Use ResearcherModelSelector. */
export type CodexModelSelector = ResearcherModelSelector;
export interface LiveWorkflowModelDefaults {
    workflow?: {
        default?: WorkflowModelSelector;
        assignments?: Partial<Record<ModelAssignmentId, WorkflowModelSelector>>;
        rosters?: Partial<Record<AiCouncilRosterId, WorkflowModelRoster>>;
    };
    researcher?: ResearcherModelSelector;
    metadata?: Record<string, Json>;
}
export interface ModelDefaultsSource {
    scope: ScopeRef;
    defaults: LiveWorkflowModelDefaults;
}
export interface ScopedModelDefaultsResponse {
    scope: ScopeRef;
    defaults: LiveWorkflowModelDefaults;
}
export interface EffectiveModelDefaultsResponse extends ScopedModelDefaultsResponse {
    sourceChain: ModelDefaultsSource[];
}
export interface ResolvedModelSelection {
    lane: ModelDefaultLane | string;
    assignment?: ModelAssignmentId | string | null;
    surface?: string | null;
    provider: string;
    model: string;
    requestedModel?: string | null;
    apiModel?: string | null;
    inferenceType?: ModelInferenceType | string | null;
    providerInferenceType?: ProviderInferenceType | null;
    reasoningEffort?: ResearcherReasoningEffort | string | null;
    providerOptions?: WorkflowModelProviderOptions;
    serviceTier?: ResearcherServiceTier | string | null;
    dynamicReasoningEffort?: boolean;
    priceConfiguration?: Record<string, Json> | null;
    pricingSource?: string | null;
    psModelId?: number | null;
    sourceChain?: ModelDefaultsSource[];
    metadata?: Record<string, Json>;
}
export interface ModelCatalogItem {
    displayName?: string | null;
    provider: string;
    model: string;
    apiModel?: string | null;
    inferenceType?: ModelInferenceType | string | null;
    modelType?: string | null;
    modelSize?: string | null;
    active: boolean;
    psModelId?: number | null;
    prices?: Record<string, Json> | null;
    pricingSource?: string | null;
    providerOptions?: WorkflowModelProviderOptions;
    capabilities?: Record<string, Json>;
    metadata?: Record<string, Json>;
}
export declare const DefaultResearcherModel: "gpt-5.5";
export declare const DefaultResearcherReasoningEffort: "xhigh";
export declare const DefaultResearcherServiceTier: "flex";
/** @deprecated Use DefaultResearcherModel. */
export declare const DefaultCodexModel: "gpt-5.5";
/** @deprecated Use DefaultResearcherReasoningEffort. */
export declare const DefaultCodexReasoningEffort: "xhigh";
/** @deprecated Use DefaultResearcherServiceTier. */
export declare const DefaultCodexServiceTier: "flex";
export interface AgentRuntimeProfile {
    id: UUID;
    scope: ScopeRef;
    name: string;
    runtimeKind: AgentRuntimeKind | string;
    containerImage?: string | null;
    /** @deprecated Historical profiles only; new model settings live under scoped researcher defaults. */
    modelDefaults?: Record<string, Json>;
    codexConfig: Record<string, Json>;
    resourcePolicy: Record<string, Json>;
    reviewPolicy: Record<string, Json>;
    metadata: Record<string, Json>;
    createdAt: ISODateTime;
    updatedAt: ISODateTime;
}
export declare const AgentAuthModes: readonly ["env_secret", "codex_chatgpt", "openai_api_key", "codex_chatgpt_with_api_fallback", "github_access_token"];
export type AgentAuthMode = (typeof AgentAuthModes)[number];
export interface AgentAuthProfile {
    id: UUID;
    scope: ScopeRef;
    provider: string;
    authMode: AgentAuthMode | string;
    secretRef?: string | null;
    metadata: Record<string, Json>;
    createdAt: ISODateTime;
    updatedAt: ISODateTime;
}
export interface DomainApiKeySummary {
    authProfileId: UUID;
    provider: string;
    configured: boolean;
    keyLast4?: string | null;
    fingerprintSha256?: string | null;
    scope: ScopeRef;
    createdAt: ISODateTime;
    updatedAt: ISODateTime;
}
export interface ApiKeyAuthOption {
    authProfileId: UUID | null;
    provider: string;
    label: string;
    configured: boolean;
    selected: boolean;
    scope?: ScopeRef | null;
}
export type CodexAuthOptionKind = "chatgpt" | "chatgpt_with_api_fallback" | "api_key";
export interface CodexAuthOption {
    authProfileId: UUID | null;
    provider: string;
    kind: CodexAuthOptionKind;
    label: string;
    configured: boolean;
    selected: boolean;
    scope?: ScopeRef | null;
    fallbackAuthProfileId?: UUID | null;
    fallbackConfigured?: boolean;
}
export interface CodexChatGptConnection {
    authProfileId: UUID | null;
    provider: string;
    connected: boolean;
    account?: Record<string, Json> | null;
    loginStatus?: string | null;
    loginId?: string | null;
    updatedAt?: ISODateTime | null;
}
export interface GroupLaunchResources {
    authProfiles: AgentAuthProfile[];
    chatGptConnection: CodexChatGptConnection;
    codexAuthOptions: CodexAuthOption[];
    runtimeProfiles: AgentRuntimeProfile[];
    vmHosts: VmHost[];
}
export interface CodexChatGptLoginStarted {
    authProfileId: UUID;
    vmHostId: UUID;
    rootPath: string;
    loginType: "chatgptDeviceCode";
    loginId: string;
    verificationUrl: string;
    userCode: string;
}
export declare const ResearcherReasoningEffortSchema: z.ZodEnum<{
    max: "max";
    high: "high";
    medium: "medium";
    low: "low";
    xhigh: "xhigh";
    none: "none";
    minimal: "minimal";
}>;
/** @deprecated Use ResearcherReasoningEffortSchema. */
export declare const CodexReasoningEffortSchema: z.ZodEnum<{
    max: "max";
    high: "high";
    medium: "medium";
    low: "low";
    xhigh: "xhigh";
    none: "none";
    minimal: "minimal";
}>;
export declare const DynamicResearcherReasoningEffortSchema: z.ZodEnum<{
    max: "max";
    high: "high";
    medium: "medium";
    xhigh: "xhigh";
}>;
/** @deprecated Use DynamicResearcherReasoningEffortSchema. */
export declare const DynamicCodexReasoningEffortSchema: z.ZodEnum<{
    max: "max";
    high: "high";
    medium: "medium";
    xhigh: "xhigh";
}>;
export declare const ResearcherServiceTierSchema: z.ZodEnum<{
    flex: "flex";
    fast: "fast";
    regular: "regular";
}>;
/** @deprecated Use ResearcherServiceTierSchema. */
export declare const CodexServiceTierSchema: z.ZodEnum<{
    flex: "flex";
    fast: "fast";
    regular: "regular";
}>;
export declare const ModelInferenceTypeSchema: z.ZodEnum<{
    priority: "priority";
    flex: "flex";
    normal: "normal";
}>;
export declare const ModelDefaultLaneSchema: z.ZodEnum<{
    workflow: "workflow";
    researcher: "researcher";
}>;
export declare const PolicySynthModelSurfaceSchema: z.ZodEnum<{
    evolution_round: "evolution_round";
    paper_distill: "paper_distill";
    paper_lay_summary: "paper_lay_summary";
    literature_sweep: "literature_sweep";
    signal_rank: "signal_rank";
    hypothesis_generate: "hypothesis_generate";
    analysis_extract: "analysis_extract";
    dynamic_paper_patch: "dynamic_paper_patch";
    brief_generate: "brief_generate";
    chief_scientist_review: "chief_scientist_review";
    preprint_planner_review: "preprint_planner_review";
    chief_human_review_options: "chief_human_review_options";
    group_continuation_extract: "group_continuation_extract";
    group_continuation_synthesis: "group_continuation_synthesis";
    ai_council_draft: "ai_council_draft";
    ai_council_rank: "ai_council_rank";
    ai_council_synthesis: "ai_council_synthesis";
    ai_council_ratify: "ai_council_ratify";
    ai_council_review: "ai_council_review";
    ai_council_vote: "ai_council_vote";
    project_creation: "project_creation";
    paper_generation: "paper_generation";
    agent_step: "agent_step";
}>;
export declare const ModelAssignmentIdSchema: z.ZodEnum<{
    "planning.experiment": "planning.experiment";
    "review.preprint": "review.preprint";
    "review.chief": "review.chief";
    "review.code_data": "review.code_data";
    "paper.generate": "paper.generate";
    "paper.distill": "paper.distill";
    "paper.lay_summary": "paper.lay_summary";
    "paper.dynamic_patch": "paper.dynamic_patch";
    "preprint.synthesis": "preprint.synthesis";
    "agent.step": "agent.step";
    "research.literature_sweep": "research.literature_sweep";
    "research.signal_rank": "research.signal_rank";
    "research.hypothesis_generate": "research.hypothesis_generate";
    "research.analysis_extract": "research.analysis_extract";
    "research.brief_generate": "research.brief_generate";
    "evolution.round": "evolution.round";
    "continuation.extract": "continuation.extract";
    "continuation.synthesis": "continuation.synthesis";
    "council.draft": "council.draft";
    "council.rank": "council.rank";
    "council.synthesis": "council.synthesis";
    "council.ratify": "council.ratify";
    "infographic.design": "infographic.design";
}>;
export declare const AiCouncilRosterIdSchema: z.ZodEnum<{
    "council.default": "council.default";
    "council.preprint": "council.preprint";
    "council.continuation": "council.continuation";
}>;
export declare const OpenAiReasoningModeSchema: z.ZodEnum<{
    standard: "standard";
    pro: "pro";
}>;
export declare const ScienceNodeRunnerKindSchema: z.ZodEnum<{
    policy_synth_task: "policy_synth_task";
    policy_synth_waterfall: "policy_synth_waterfall";
    single_model_task: "single_model_task";
    external_job: "external_job";
}>;
export declare const WorkflowModelProviderOptionsSchema: z.ZodObject<{
    openai: z.ZodOptional<z.ZodObject<{
        reasoningMode: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            standard: "standard";
            pro: "pro";
        }>>>;
    }, z.core.$loose>>;
    anthropic: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    google: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
}, z.core.$catchall<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>;
export declare const WorkflowModelSelectorSchema: z.ZodObject<{
    provider: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
    apiModel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    inferenceType: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodEnum<{
        priority: "priority";
        flex: "flex";
        normal: "normal";
    }>, z.ZodString]>>>;
    reasoningEffort: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    providerOptions: z.ZodOptional<z.ZodObject<{
        openai: z.ZodOptional<z.ZodObject<{
            reasoningMode: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
                standard: "standard";
                pro: "pro";
            }>>>;
        }, z.core.$loose>>;
        anthropic: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
        google: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    }, z.core.$catchall<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
}, z.core.$strict>;
/** @deprecated Internal compatibility alias. */
export declare const PolicySynthModelSelectorSchema: z.ZodObject<{
    provider: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
    apiModel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    inferenceType: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodEnum<{
        priority: "priority";
        flex: "flex";
        normal: "normal";
    }>, z.ZodString]>>>;
    reasoningEffort: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    providerOptions: z.ZodOptional<z.ZodObject<{
        openai: z.ZodOptional<z.ZodObject<{
            reasoningMode: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
                standard: "standard";
                pro: "pro";
            }>>>;
        }, z.core.$loose>>;
        anthropic: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
        google: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    }, z.core.$catchall<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
}, z.core.$strict>;
export declare const WorkflowModelRosterMemberSchema: z.ZodObject<{
    id: z.ZodString;
    label: z.ZodOptional<z.ZodString>;
    selector: z.ZodObject<{
        provider: z.ZodOptional<z.ZodString>;
        model: z.ZodOptional<z.ZodString>;
        apiModel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        inferenceType: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodEnum<{
            priority: "priority";
            flex: "flex";
            normal: "normal";
        }>, z.ZodString]>>>;
        reasoningEffort: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        providerOptions: z.ZodOptional<z.ZodObject<{
            openai: z.ZodOptional<z.ZodObject<{
                reasoningMode: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
                    standard: "standard";
                    pro: "pro";
                }>>>;
            }, z.core.$loose>>;
            anthropic: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
            google: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
        }, z.core.$catchall<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const WorkflowModelRosterSchema: z.ZodObject<{
    members: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodOptional<z.ZodString>;
        selector: z.ZodObject<{
            provider: z.ZodOptional<z.ZodString>;
            model: z.ZodOptional<z.ZodString>;
            apiModel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            inferenceType: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodEnum<{
                priority: "priority";
                flex: "flex";
                normal: "normal";
            }>, z.ZodString]>>>;
            reasoningEffort: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            providerOptions: z.ZodOptional<z.ZodObject<{
                openai: z.ZodOptional<z.ZodObject<{
                    reasoningMode: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
                        standard: "standard";
                        pro: "pro";
                    }>>>;
                }, z.core.$loose>>;
                anthropic: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
                google: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
            }, z.core.$catchall<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
        }, z.core.$strict>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const ResearcherModelSelectorSchema: z.ZodObject<{
    model: z.ZodOptional<z.ZodString>;
    reasoningEffort: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        max: "max";
        high: "high";
        medium: "medium";
        low: "low";
        xhigh: "xhigh";
        none: "none";
        minimal: "minimal";
    }>, z.ZodString]>>;
    serviceTier: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        flex: "flex";
        fast: "fast";
        regular: "regular";
    }>, z.ZodString]>>;
    dynamicReasoningEffort: z.ZodOptional<z.ZodBoolean>;
    modelProvider: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
}, z.core.$loose>;
/** @deprecated Use ResearcherModelSelectorSchema. */
export declare const CodexModelSelectorSchema: z.ZodObject<{
    model: z.ZodOptional<z.ZodString>;
    reasoningEffort: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        max: "max";
        high: "high";
        medium: "medium";
        low: "low";
        xhigh: "xhigh";
        none: "none";
        minimal: "minimal";
    }>, z.ZodString]>>;
    serviceTier: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        flex: "flex";
        fast: "fast";
        regular: "regular";
    }>, z.ZodString]>>;
    dynamicReasoningEffort: z.ZodOptional<z.ZodBoolean>;
    modelProvider: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
}, z.core.$loose>;
export declare const LiveWorkflowModelDefaultsSchema: z.ZodObject<{
    workflow: z.ZodOptional<z.ZodObject<{
        default: z.ZodOptional<z.ZodObject<{
            provider: z.ZodOptional<z.ZodString>;
            model: z.ZodOptional<z.ZodString>;
            apiModel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            inferenceType: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodEnum<{
                priority: "priority";
                flex: "flex";
                normal: "normal";
            }>, z.ZodString]>>>;
            reasoningEffort: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            providerOptions: z.ZodOptional<z.ZodObject<{
                openai: z.ZodOptional<z.ZodObject<{
                    reasoningMode: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
                        standard: "standard";
                        pro: "pro";
                    }>>>;
                }, z.core.$loose>>;
                anthropic: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
                google: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
            }, z.core.$catchall<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
        }, z.core.$strict>>;
        assignments: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
            "planning.experiment": "planning.experiment";
            "review.preprint": "review.preprint";
            "review.chief": "review.chief";
            "review.code_data": "review.code_data";
            "paper.generate": "paper.generate";
            "paper.distill": "paper.distill";
            "paper.lay_summary": "paper.lay_summary";
            "paper.dynamic_patch": "paper.dynamic_patch";
            "preprint.synthesis": "preprint.synthesis";
            "agent.step": "agent.step";
            "research.literature_sweep": "research.literature_sweep";
            "research.signal_rank": "research.signal_rank";
            "research.hypothesis_generate": "research.hypothesis_generate";
            "research.analysis_extract": "research.analysis_extract";
            "research.brief_generate": "research.brief_generate";
            "evolution.round": "evolution.round";
            "continuation.extract": "continuation.extract";
            "continuation.synthesis": "continuation.synthesis";
            "council.draft": "council.draft";
            "council.rank": "council.rank";
            "council.synthesis": "council.synthesis";
            "council.ratify": "council.ratify";
            "infographic.design": "infographic.design";
        }> & z.core.$partial, z.ZodObject<{
            provider: z.ZodOptional<z.ZodString>;
            model: z.ZodOptional<z.ZodString>;
            apiModel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            inferenceType: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodEnum<{
                priority: "priority";
                flex: "flex";
                normal: "normal";
            }>, z.ZodString]>>>;
            reasoningEffort: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            providerOptions: z.ZodOptional<z.ZodObject<{
                openai: z.ZodOptional<z.ZodObject<{
                    reasoningMode: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
                        standard: "standard";
                        pro: "pro";
                    }>>>;
                }, z.core.$loose>>;
                anthropic: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
                google: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
            }, z.core.$catchall<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
        }, z.core.$strict>>>;
        rosters: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
            "council.default": "council.default";
            "council.preprint": "council.preprint";
            "council.continuation": "council.continuation";
        }> & z.core.$partial, z.ZodObject<{
            members: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                label: z.ZodOptional<z.ZodString>;
                selector: z.ZodObject<{
                    provider: z.ZodOptional<z.ZodString>;
                    model: z.ZodOptional<z.ZodString>;
                    apiModel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    inferenceType: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodEnum<{
                        priority: "priority";
                        flex: "flex";
                        normal: "normal";
                    }>, z.ZodString]>>>;
                    reasoningEffort: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    providerOptions: z.ZodOptional<z.ZodObject<{
                        openai: z.ZodOptional<z.ZodObject<{
                            reasoningMode: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
                                standard: "standard";
                                pro: "pro";
                            }>>>;
                        }, z.core.$loose>>;
                        anthropic: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
                        google: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
                    }, z.core.$catchall<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>>;
                    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
                }, z.core.$strict>;
            }, z.core.$strict>>;
        }, z.core.$strict>>>;
    }, z.core.$strict>>;
    researcher: z.ZodOptional<z.ZodObject<{
        model: z.ZodOptional<z.ZodString>;
        reasoningEffort: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
            max: "max";
            high: "high";
            medium: "medium";
            low: "low";
            xhigh: "xhigh";
            none: "none";
            minimal: "minimal";
        }>, z.ZodString]>>;
        serviceTier: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
            flex: "flex";
            fast: "fast";
            regular: "regular";
        }>, z.ZodString]>>;
        dynamicReasoningEffort: z.ZodOptional<z.ZodBoolean>;
        modelProvider: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    }, z.core.$loose>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
}, z.core.$strict>;
export declare const ModelDefaultsSourceSchema: z.ZodObject<{
    scope: z.ZodObject<{
        type: z.ZodEnum<{
            user: "user";
            domain: "domain";
            community: "community";
            group: "group";
            run: "run";
            signal: "signal";
            session: "session";
            experiment: "experiment";
            run_step: "run_step";
            boundary: "boundary";
            artifact: "artifact";
            dataset: "dataset";
            finding: "finding";
            paper: "paper";
            knowledge_source: "knowledge_source";
            sweep_job: "sweep_job";
            knowledge_document: "knowledge_document";
            knowledge_document_chunk: "knowledge_document_chunk";
            knowledge_signal: "knowledge_signal";
            science_agent_run: "science_agent_run";
            project_corpus: "project_corpus";
            hypothesis: "hypothesis";
            research_embedding: "research_embedding";
            embedding_job: "embedding_job";
            morning_brief: "morning_brief";
            dynamic_paper: "dynamic_paper";
            dynamic_paper_revision: "dynamic_paper_revision";
            dynamic_paper_section: "dynamic_paper_section";
            dynamic_paper_claim: "dynamic_paper_claim";
            dynamic_paper_evidence_link: "dynamic_paper_evidence_link";
            dynamic_paper_update: "dynamic_paper_update";
            evolution_program: "evolution_program";
            evolution_round: "evolution_round";
            evolution_candidate: "evolution_candidate";
            evolution_evaluation: "evolution_evaluation";
            evolution_archive_cell: "evolution_archive_cell";
            review_case: "review_case";
            vm: "vm";
        }>;
        id: z.ZodString;
    }, z.core.$strict>;
    defaults: z.ZodObject<{
        workflow: z.ZodOptional<z.ZodObject<{
            default: z.ZodOptional<z.ZodObject<{
                provider: z.ZodOptional<z.ZodString>;
                model: z.ZodOptional<z.ZodString>;
                apiModel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                inferenceType: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodEnum<{
                    priority: "priority";
                    flex: "flex";
                    normal: "normal";
                }>, z.ZodString]>>>;
                reasoningEffort: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                providerOptions: z.ZodOptional<z.ZodObject<{
                    openai: z.ZodOptional<z.ZodObject<{
                        reasoningMode: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
                            standard: "standard";
                            pro: "pro";
                        }>>>;
                    }, z.core.$loose>>;
                    anthropic: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
                    google: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
                }, z.core.$catchall<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
            }, z.core.$strict>>;
            assignments: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
                "planning.experiment": "planning.experiment";
                "review.preprint": "review.preprint";
                "review.chief": "review.chief";
                "review.code_data": "review.code_data";
                "paper.generate": "paper.generate";
                "paper.distill": "paper.distill";
                "paper.lay_summary": "paper.lay_summary";
                "paper.dynamic_patch": "paper.dynamic_patch";
                "preprint.synthesis": "preprint.synthesis";
                "agent.step": "agent.step";
                "research.literature_sweep": "research.literature_sweep";
                "research.signal_rank": "research.signal_rank";
                "research.hypothesis_generate": "research.hypothesis_generate";
                "research.analysis_extract": "research.analysis_extract";
                "research.brief_generate": "research.brief_generate";
                "evolution.round": "evolution.round";
                "continuation.extract": "continuation.extract";
                "continuation.synthesis": "continuation.synthesis";
                "council.draft": "council.draft";
                "council.rank": "council.rank";
                "council.synthesis": "council.synthesis";
                "council.ratify": "council.ratify";
                "infographic.design": "infographic.design";
            }> & z.core.$partial, z.ZodObject<{
                provider: z.ZodOptional<z.ZodString>;
                model: z.ZodOptional<z.ZodString>;
                apiModel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                inferenceType: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodEnum<{
                    priority: "priority";
                    flex: "flex";
                    normal: "normal";
                }>, z.ZodString]>>>;
                reasoningEffort: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                providerOptions: z.ZodOptional<z.ZodObject<{
                    openai: z.ZodOptional<z.ZodObject<{
                        reasoningMode: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
                            standard: "standard";
                            pro: "pro";
                        }>>>;
                    }, z.core.$loose>>;
                    anthropic: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
                    google: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
                }, z.core.$catchall<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
            }, z.core.$strict>>>;
            rosters: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
                "council.default": "council.default";
                "council.preprint": "council.preprint";
                "council.continuation": "council.continuation";
            }> & z.core.$partial, z.ZodObject<{
                members: z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    label: z.ZodOptional<z.ZodString>;
                    selector: z.ZodObject<{
                        provider: z.ZodOptional<z.ZodString>;
                        model: z.ZodOptional<z.ZodString>;
                        apiModel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        inferenceType: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodEnum<{
                            priority: "priority";
                            flex: "flex";
                            normal: "normal";
                        }>, z.ZodString]>>>;
                        reasoningEffort: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        providerOptions: z.ZodOptional<z.ZodObject<{
                            openai: z.ZodOptional<z.ZodObject<{
                                reasoningMode: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
                                    standard: "standard";
                                    pro: "pro";
                                }>>>;
                            }, z.core.$loose>>;
                            anthropic: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
                            google: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
                        }, z.core.$catchall<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>>;
                        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
                    }, z.core.$strict>;
                }, z.core.$strict>>;
            }, z.core.$strict>>>;
        }, z.core.$strict>>;
        researcher: z.ZodOptional<z.ZodObject<{
            model: z.ZodOptional<z.ZodString>;
            reasoningEffort: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
                max: "max";
                high: "high";
                medium: "medium";
                low: "low";
                xhigh: "xhigh";
                none: "none";
                minimal: "minimal";
            }>, z.ZodString]>>;
            serviceTier: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
                flex: "flex";
                fast: "fast";
                regular: "regular";
            }>, z.ZodString]>>;
            dynamicReasoningEffort: z.ZodOptional<z.ZodBoolean>;
            modelProvider: z.ZodOptional<z.ZodString>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
        }, z.core.$loose>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const ScopedModelDefaultsResponseSchema: z.ZodObject<{
    scope: z.ZodObject<{
        type: z.ZodEnum<{
            user: "user";
            domain: "domain";
            community: "community";
            group: "group";
            run: "run";
            signal: "signal";
            session: "session";
            experiment: "experiment";
            run_step: "run_step";
            boundary: "boundary";
            artifact: "artifact";
            dataset: "dataset";
            finding: "finding";
            paper: "paper";
            knowledge_source: "knowledge_source";
            sweep_job: "sweep_job";
            knowledge_document: "knowledge_document";
            knowledge_document_chunk: "knowledge_document_chunk";
            knowledge_signal: "knowledge_signal";
            science_agent_run: "science_agent_run";
            project_corpus: "project_corpus";
            hypothesis: "hypothesis";
            research_embedding: "research_embedding";
            embedding_job: "embedding_job";
            morning_brief: "morning_brief";
            dynamic_paper: "dynamic_paper";
            dynamic_paper_revision: "dynamic_paper_revision";
            dynamic_paper_section: "dynamic_paper_section";
            dynamic_paper_claim: "dynamic_paper_claim";
            dynamic_paper_evidence_link: "dynamic_paper_evidence_link";
            dynamic_paper_update: "dynamic_paper_update";
            evolution_program: "evolution_program";
            evolution_round: "evolution_round";
            evolution_candidate: "evolution_candidate";
            evolution_evaluation: "evolution_evaluation";
            evolution_archive_cell: "evolution_archive_cell";
            review_case: "review_case";
            vm: "vm";
        }>;
        id: z.ZodString;
    }, z.core.$strict>;
    defaults: z.ZodObject<{
        workflow: z.ZodOptional<z.ZodObject<{
            default: z.ZodOptional<z.ZodObject<{
                provider: z.ZodOptional<z.ZodString>;
                model: z.ZodOptional<z.ZodString>;
                apiModel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                inferenceType: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodEnum<{
                    priority: "priority";
                    flex: "flex";
                    normal: "normal";
                }>, z.ZodString]>>>;
                reasoningEffort: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                providerOptions: z.ZodOptional<z.ZodObject<{
                    openai: z.ZodOptional<z.ZodObject<{
                        reasoningMode: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
                            standard: "standard";
                            pro: "pro";
                        }>>>;
                    }, z.core.$loose>>;
                    anthropic: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
                    google: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
                }, z.core.$catchall<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
            }, z.core.$strict>>;
            assignments: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
                "planning.experiment": "planning.experiment";
                "review.preprint": "review.preprint";
                "review.chief": "review.chief";
                "review.code_data": "review.code_data";
                "paper.generate": "paper.generate";
                "paper.distill": "paper.distill";
                "paper.lay_summary": "paper.lay_summary";
                "paper.dynamic_patch": "paper.dynamic_patch";
                "preprint.synthesis": "preprint.synthesis";
                "agent.step": "agent.step";
                "research.literature_sweep": "research.literature_sweep";
                "research.signal_rank": "research.signal_rank";
                "research.hypothesis_generate": "research.hypothesis_generate";
                "research.analysis_extract": "research.analysis_extract";
                "research.brief_generate": "research.brief_generate";
                "evolution.round": "evolution.round";
                "continuation.extract": "continuation.extract";
                "continuation.synthesis": "continuation.synthesis";
                "council.draft": "council.draft";
                "council.rank": "council.rank";
                "council.synthesis": "council.synthesis";
                "council.ratify": "council.ratify";
                "infographic.design": "infographic.design";
            }> & z.core.$partial, z.ZodObject<{
                provider: z.ZodOptional<z.ZodString>;
                model: z.ZodOptional<z.ZodString>;
                apiModel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                inferenceType: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodEnum<{
                    priority: "priority";
                    flex: "flex";
                    normal: "normal";
                }>, z.ZodString]>>>;
                reasoningEffort: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                providerOptions: z.ZodOptional<z.ZodObject<{
                    openai: z.ZodOptional<z.ZodObject<{
                        reasoningMode: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
                            standard: "standard";
                            pro: "pro";
                        }>>>;
                    }, z.core.$loose>>;
                    anthropic: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
                    google: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
                }, z.core.$catchall<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
            }, z.core.$strict>>>;
            rosters: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
                "council.default": "council.default";
                "council.preprint": "council.preprint";
                "council.continuation": "council.continuation";
            }> & z.core.$partial, z.ZodObject<{
                members: z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    label: z.ZodOptional<z.ZodString>;
                    selector: z.ZodObject<{
                        provider: z.ZodOptional<z.ZodString>;
                        model: z.ZodOptional<z.ZodString>;
                        apiModel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        inferenceType: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodEnum<{
                            priority: "priority";
                            flex: "flex";
                            normal: "normal";
                        }>, z.ZodString]>>>;
                        reasoningEffort: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        providerOptions: z.ZodOptional<z.ZodObject<{
                            openai: z.ZodOptional<z.ZodObject<{
                                reasoningMode: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
                                    standard: "standard";
                                    pro: "pro";
                                }>>>;
                            }, z.core.$loose>>;
                            anthropic: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
                            google: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
                        }, z.core.$catchall<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>>;
                        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
                    }, z.core.$strict>;
                }, z.core.$strict>>;
            }, z.core.$strict>>>;
        }, z.core.$strict>>;
        researcher: z.ZodOptional<z.ZodObject<{
            model: z.ZodOptional<z.ZodString>;
            reasoningEffort: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
                max: "max";
                high: "high";
                medium: "medium";
                low: "low";
                xhigh: "xhigh";
                none: "none";
                minimal: "minimal";
            }>, z.ZodString]>>;
            serviceTier: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
                flex: "flex";
                fast: "fast";
                regular: "regular";
            }>, z.ZodString]>>;
            dynamicReasoningEffort: z.ZodOptional<z.ZodBoolean>;
            modelProvider: z.ZodOptional<z.ZodString>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
        }, z.core.$loose>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const EffectiveModelDefaultsResponseSchema: z.ZodObject<{
    scope: z.ZodObject<{
        type: z.ZodEnum<{
            user: "user";
            domain: "domain";
            community: "community";
            group: "group";
            run: "run";
            signal: "signal";
            session: "session";
            experiment: "experiment";
            run_step: "run_step";
            boundary: "boundary";
            artifact: "artifact";
            dataset: "dataset";
            finding: "finding";
            paper: "paper";
            knowledge_source: "knowledge_source";
            sweep_job: "sweep_job";
            knowledge_document: "knowledge_document";
            knowledge_document_chunk: "knowledge_document_chunk";
            knowledge_signal: "knowledge_signal";
            science_agent_run: "science_agent_run";
            project_corpus: "project_corpus";
            hypothesis: "hypothesis";
            research_embedding: "research_embedding";
            embedding_job: "embedding_job";
            morning_brief: "morning_brief";
            dynamic_paper: "dynamic_paper";
            dynamic_paper_revision: "dynamic_paper_revision";
            dynamic_paper_section: "dynamic_paper_section";
            dynamic_paper_claim: "dynamic_paper_claim";
            dynamic_paper_evidence_link: "dynamic_paper_evidence_link";
            dynamic_paper_update: "dynamic_paper_update";
            evolution_program: "evolution_program";
            evolution_round: "evolution_round";
            evolution_candidate: "evolution_candidate";
            evolution_evaluation: "evolution_evaluation";
            evolution_archive_cell: "evolution_archive_cell";
            review_case: "review_case";
            vm: "vm";
        }>;
        id: z.ZodString;
    }, z.core.$strict>;
    defaults: z.ZodObject<{
        workflow: z.ZodOptional<z.ZodObject<{
            default: z.ZodOptional<z.ZodObject<{
                provider: z.ZodOptional<z.ZodString>;
                model: z.ZodOptional<z.ZodString>;
                apiModel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                inferenceType: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodEnum<{
                    priority: "priority";
                    flex: "flex";
                    normal: "normal";
                }>, z.ZodString]>>>;
                reasoningEffort: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                providerOptions: z.ZodOptional<z.ZodObject<{
                    openai: z.ZodOptional<z.ZodObject<{
                        reasoningMode: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
                            standard: "standard";
                            pro: "pro";
                        }>>>;
                    }, z.core.$loose>>;
                    anthropic: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
                    google: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
                }, z.core.$catchall<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
            }, z.core.$strict>>;
            assignments: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
                "planning.experiment": "planning.experiment";
                "review.preprint": "review.preprint";
                "review.chief": "review.chief";
                "review.code_data": "review.code_data";
                "paper.generate": "paper.generate";
                "paper.distill": "paper.distill";
                "paper.lay_summary": "paper.lay_summary";
                "paper.dynamic_patch": "paper.dynamic_patch";
                "preprint.synthesis": "preprint.synthesis";
                "agent.step": "agent.step";
                "research.literature_sweep": "research.literature_sweep";
                "research.signal_rank": "research.signal_rank";
                "research.hypothesis_generate": "research.hypothesis_generate";
                "research.analysis_extract": "research.analysis_extract";
                "research.brief_generate": "research.brief_generate";
                "evolution.round": "evolution.round";
                "continuation.extract": "continuation.extract";
                "continuation.synthesis": "continuation.synthesis";
                "council.draft": "council.draft";
                "council.rank": "council.rank";
                "council.synthesis": "council.synthesis";
                "council.ratify": "council.ratify";
                "infographic.design": "infographic.design";
            }> & z.core.$partial, z.ZodObject<{
                provider: z.ZodOptional<z.ZodString>;
                model: z.ZodOptional<z.ZodString>;
                apiModel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                inferenceType: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodEnum<{
                    priority: "priority";
                    flex: "flex";
                    normal: "normal";
                }>, z.ZodString]>>>;
                reasoningEffort: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                providerOptions: z.ZodOptional<z.ZodObject<{
                    openai: z.ZodOptional<z.ZodObject<{
                        reasoningMode: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
                            standard: "standard";
                            pro: "pro";
                        }>>>;
                    }, z.core.$loose>>;
                    anthropic: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
                    google: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
                }, z.core.$catchall<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
            }, z.core.$strict>>>;
            rosters: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
                "council.default": "council.default";
                "council.preprint": "council.preprint";
                "council.continuation": "council.continuation";
            }> & z.core.$partial, z.ZodObject<{
                members: z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    label: z.ZodOptional<z.ZodString>;
                    selector: z.ZodObject<{
                        provider: z.ZodOptional<z.ZodString>;
                        model: z.ZodOptional<z.ZodString>;
                        apiModel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        inferenceType: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodEnum<{
                            priority: "priority";
                            flex: "flex";
                            normal: "normal";
                        }>, z.ZodString]>>>;
                        reasoningEffort: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        providerOptions: z.ZodOptional<z.ZodObject<{
                            openai: z.ZodOptional<z.ZodObject<{
                                reasoningMode: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
                                    standard: "standard";
                                    pro: "pro";
                                }>>>;
                            }, z.core.$loose>>;
                            anthropic: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
                            google: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
                        }, z.core.$catchall<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>>;
                        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
                    }, z.core.$strict>;
                }, z.core.$strict>>;
            }, z.core.$strict>>>;
        }, z.core.$strict>>;
        researcher: z.ZodOptional<z.ZodObject<{
            model: z.ZodOptional<z.ZodString>;
            reasoningEffort: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
                max: "max";
                high: "high";
                medium: "medium";
                low: "low";
                xhigh: "xhigh";
                none: "none";
                minimal: "minimal";
            }>, z.ZodString]>>;
            serviceTier: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
                flex: "flex";
                fast: "fast";
                regular: "regular";
            }>, z.ZodString]>>;
            dynamicReasoningEffort: z.ZodOptional<z.ZodBoolean>;
            modelProvider: z.ZodOptional<z.ZodString>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
        }, z.core.$loose>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    }, z.core.$strict>;
    sourceChain: z.ZodArray<z.ZodObject<{
        scope: z.ZodObject<{
            type: z.ZodEnum<{
                user: "user";
                domain: "domain";
                community: "community";
                group: "group";
                run: "run";
                signal: "signal";
                session: "session";
                experiment: "experiment";
                run_step: "run_step";
                boundary: "boundary";
                artifact: "artifact";
                dataset: "dataset";
                finding: "finding";
                paper: "paper";
                knowledge_source: "knowledge_source";
                sweep_job: "sweep_job";
                knowledge_document: "knowledge_document";
                knowledge_document_chunk: "knowledge_document_chunk";
                knowledge_signal: "knowledge_signal";
                science_agent_run: "science_agent_run";
                project_corpus: "project_corpus";
                hypothesis: "hypothesis";
                research_embedding: "research_embedding";
                embedding_job: "embedding_job";
                morning_brief: "morning_brief";
                dynamic_paper: "dynamic_paper";
                dynamic_paper_revision: "dynamic_paper_revision";
                dynamic_paper_section: "dynamic_paper_section";
                dynamic_paper_claim: "dynamic_paper_claim";
                dynamic_paper_evidence_link: "dynamic_paper_evidence_link";
                dynamic_paper_update: "dynamic_paper_update";
                evolution_program: "evolution_program";
                evolution_round: "evolution_round";
                evolution_candidate: "evolution_candidate";
                evolution_evaluation: "evolution_evaluation";
                evolution_archive_cell: "evolution_archive_cell";
                review_case: "review_case";
                vm: "vm";
            }>;
            id: z.ZodString;
        }, z.core.$strict>;
        defaults: z.ZodObject<{
            workflow: z.ZodOptional<z.ZodObject<{
                default: z.ZodOptional<z.ZodObject<{
                    provider: z.ZodOptional<z.ZodString>;
                    model: z.ZodOptional<z.ZodString>;
                    apiModel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    inferenceType: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodEnum<{
                        priority: "priority";
                        flex: "flex";
                        normal: "normal";
                    }>, z.ZodString]>>>;
                    reasoningEffort: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    providerOptions: z.ZodOptional<z.ZodObject<{
                        openai: z.ZodOptional<z.ZodObject<{
                            reasoningMode: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
                                standard: "standard";
                                pro: "pro";
                            }>>>;
                        }, z.core.$loose>>;
                        anthropic: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
                        google: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
                    }, z.core.$catchall<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>>;
                    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
                }, z.core.$strict>>;
                assignments: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
                    "planning.experiment": "planning.experiment";
                    "review.preprint": "review.preprint";
                    "review.chief": "review.chief";
                    "review.code_data": "review.code_data";
                    "paper.generate": "paper.generate";
                    "paper.distill": "paper.distill";
                    "paper.lay_summary": "paper.lay_summary";
                    "paper.dynamic_patch": "paper.dynamic_patch";
                    "preprint.synthesis": "preprint.synthesis";
                    "agent.step": "agent.step";
                    "research.literature_sweep": "research.literature_sweep";
                    "research.signal_rank": "research.signal_rank";
                    "research.hypothesis_generate": "research.hypothesis_generate";
                    "research.analysis_extract": "research.analysis_extract";
                    "research.brief_generate": "research.brief_generate";
                    "evolution.round": "evolution.round";
                    "continuation.extract": "continuation.extract";
                    "continuation.synthesis": "continuation.synthesis";
                    "council.draft": "council.draft";
                    "council.rank": "council.rank";
                    "council.synthesis": "council.synthesis";
                    "council.ratify": "council.ratify";
                    "infographic.design": "infographic.design";
                }> & z.core.$partial, z.ZodObject<{
                    provider: z.ZodOptional<z.ZodString>;
                    model: z.ZodOptional<z.ZodString>;
                    apiModel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    inferenceType: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodEnum<{
                        priority: "priority";
                        flex: "flex";
                        normal: "normal";
                    }>, z.ZodString]>>>;
                    reasoningEffort: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    providerOptions: z.ZodOptional<z.ZodObject<{
                        openai: z.ZodOptional<z.ZodObject<{
                            reasoningMode: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
                                standard: "standard";
                                pro: "pro";
                            }>>>;
                        }, z.core.$loose>>;
                        anthropic: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
                        google: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
                    }, z.core.$catchall<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>>;
                    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
                }, z.core.$strict>>>;
                rosters: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
                    "council.default": "council.default";
                    "council.preprint": "council.preprint";
                    "council.continuation": "council.continuation";
                }> & z.core.$partial, z.ZodObject<{
                    members: z.ZodArray<z.ZodObject<{
                        id: z.ZodString;
                        label: z.ZodOptional<z.ZodString>;
                        selector: z.ZodObject<{
                            provider: z.ZodOptional<z.ZodString>;
                            model: z.ZodOptional<z.ZodString>;
                            apiModel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                            inferenceType: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodEnum<{
                                priority: "priority";
                                flex: "flex";
                                normal: "normal";
                            }>, z.ZodString]>>>;
                            reasoningEffort: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                            providerOptions: z.ZodOptional<z.ZodObject<{
                                openai: z.ZodOptional<z.ZodObject<{
                                    reasoningMode: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
                                        standard: "standard";
                                        pro: "pro";
                                    }>>>;
                                }, z.core.$loose>>;
                                anthropic: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
                                google: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
                            }, z.core.$catchall<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>>;
                            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
                        }, z.core.$strict>;
                    }, z.core.$strict>>;
                }, z.core.$strict>>>;
            }, z.core.$strict>>;
            researcher: z.ZodOptional<z.ZodObject<{
                model: z.ZodOptional<z.ZodString>;
                reasoningEffort: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
                    max: "max";
                    high: "high";
                    medium: "medium";
                    low: "low";
                    xhigh: "xhigh";
                    none: "none";
                    minimal: "minimal";
                }>, z.ZodString]>>;
                serviceTier: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
                    flex: "flex";
                    fast: "fast";
                    regular: "regular";
                }>, z.ZodString]>>;
                dynamicReasoningEffort: z.ZodOptional<z.ZodBoolean>;
                modelProvider: z.ZodOptional<z.ZodString>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
            }, z.core.$loose>>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
        }, z.core.$strict>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const ResearcherModelSchema: z.ZodDefault<z.ZodString>;
/** @deprecated Use ResearcherModelSchema. */
export declare const CodexModelSchema: z.ZodDefault<z.ZodString>;
export declare const ResearcherCoreModelSettingsSchema: z.ZodObject<{
    model: z.ZodDefault<z.ZodString>;
    reasoningEffort: z.ZodDefault<z.ZodEnum<{
        max: "max";
        high: "high";
        medium: "medium";
        low: "low";
        xhigh: "xhigh";
        none: "none";
        minimal: "minimal";
    }>>;
    serviceTier: z.ZodDefault<z.ZodEnum<{
        flex: "flex";
        fast: "fast";
        regular: "regular";
    }>>;
    dynamicReasoningEffort: z.ZodOptional<z.ZodBoolean>;
}, z.core.$loose>;
/** @deprecated Use ResearcherCoreModelSettingsSchema. */
export declare const CodexCoreModelSettingsSchema: z.ZodObject<{
    model: z.ZodDefault<z.ZodString>;
    reasoningEffort: z.ZodDefault<z.ZodEnum<{
        max: "max";
        high: "high";
        medium: "medium";
        low: "low";
        xhigh: "xhigh";
        none: "none";
        minimal: "minimal";
    }>>;
    serviceTier: z.ZodDefault<z.ZodEnum<{
        flex: "flex";
        fast: "fast";
        regular: "regular";
    }>>;
    dynamicReasoningEffort: z.ZodOptional<z.ZodBoolean>;
}, z.core.$loose>;
export declare function normalizeResearcherModelSettings(value: unknown): Record<string, Json>;
/** @deprecated Use normalizeResearcherModelSettings. */
export declare const normalizeCodexModelDefaults: typeof normalizeResearcherModelSettings;
export declare function normalizeResearcherModelSettingsWithLegacyConfigFallback(value: unknown, codexConfig: unknown): Record<string, Json>;
/** @deprecated Historical runtime-snapshot adapter. */
export declare const normalizeCodexModelDefaultsWithConfigFallback: typeof normalizeResearcherModelSettingsWithLegacyConfigFallback;
export declare const AgentRuntimeDockerPolicySchema: z.ZodObject<{
    network: z.ZodOptional<z.ZodEnum<{
        none: "none";
        provider: "provider";
    }>>;
    gpus: z.ZodOptional<z.ZodEnum<{
        all: "all";
        none: "none";
    }>>;
    memoryBytes: z.ZodOptional<z.ZodNumber>;
    cpus: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
    pidsLimit: z.ZodOptional<z.ZodNumber>;
    nofileSoft: z.ZodOptional<z.ZodNumber>;
    nofileHard: z.ZodOptional<z.ZodNumber>;
    readOnlyRootFilesystem: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare function normalizeAgentRuntimeDockerPolicy(value: unknown, options?: {
    allowLegacyNetworkValues?: boolean;
    allowUnknownFields?: boolean;
}): AgentRuntimeDockerPolicy;
export declare const WorkflowNodeKindSchema: z.ZodEnum<{
    evolution_round: "evolution_round";
    human_review: "human_review";
    noop: "noop";
    codex_session: "codex_session";
    literature_sweep: "literature_sweep";
    signal_rank: "signal_rank";
    hypothesis_generate: "hypothesis_generate";
    analysis_extract: "analysis_extract";
    dynamic_paper_patch: "dynamic_paper_patch";
    brief_generate: "brief_generate";
    artifact_publish: "artifact_publish";
}>;
export declare const WorkflowTemplateStatusSchema: z.ZodEnum<{
    active: "active";
    draft: "draft";
    archived: "archived";
}>;
export declare const WorkflowTemplateRevisionStatusSchema: z.ZodEnum<{
    published: "published";
    draft: "draft";
    archived: "archived";
}>;
export declare const PromptBindingTargetKindSchema: z.ZodEnum<{
    morning_brief: "morning_brief";
    evolution_round: "evolution_round";
    paper_draft: "paper_draft";
    paper_distill: "paper_distill";
    paper_lay_summary: "paper_lay_summary";
    literature_sweep: "literature_sweep";
    signal_rank: "signal_rank";
    hypothesis_generate: "hypothesis_generate";
    analysis_extract: "analysis_extract";
    dynamic_paper_patch: "dynamic_paper_patch";
    brief_generate: "brief_generate";
    chief_scientist_review: "chief_scientist_review";
    chief_scientist_reasoning_effort: "chief_scientist_reasoning_effort";
    codex_agents_md: "codex_agents_md";
    codex_skill: "codex_skill";
    group_final_review_agents_md: "group_final_review_agents_md";
    code_data_review: "code_data_review";
    group_final_review_reviewer: "group_final_review_reviewer";
    group_final_review_reviewer_correction: "group_final_review_reviewer_correction";
    group_final_review_preprint_draft: "group_final_review_preprint_draft";
    group_final_review_preprint_draft_correction: "group_final_review_preprint_draft_correction";
    group_final_review_preprint_revision: "group_final_review_preprint_revision";
    group_final_review_preprint_revision_correction: "group_final_review_preprint_revision_correction";
    group_final_review_council_member_system: "group_final_review_council_member_system";
    group_final_review_council_chair_system: "group_final_review_council_chair_system";
    group_final_review_distill_correction: "group_final_review_distill_correction";
    group_final_review_lay_summary_correction: "group_final_review_lay_summary_correction";
    experiment_plan_generator: "experiment_plan_generator";
    experiment_group_plan_generator_system: "experiment_group_plan_generator_system";
    experiment_group_plan_simple_review: "experiment_group_plan_simple_review";
    serial_experiment_planning_policy: "serial_experiment_planning_policy";
    experiment_full_plan_template: "experiment_full_plan_template";
    experiment_agents_md_template: "experiment_agents_md_template";
    experiment_dataset_agents_md_template: "experiment_dataset_agents_md_template";
    experiment_github_agents_md_injection: "experiment_github_agents_md_injection";
    experiment_research_plan_template: "experiment_research_plan_template";
    experiment_initial_research_step_instruction: "experiment_initial_research_step_instruction";
    paper_review: "paper_review";
    preprint_planner_review: "preprint_planner_review";
    preprint_council: "preprint_council";
    chief_human_review_options: "chief_human_review_options";
    paper_patch: "paper_patch";
    group_continuation_extract: "group_continuation_extract";
    group_continuation_synthesis: "group_continuation_synthesis";
    ai_council_draft: "ai_council_draft";
    ai_council_rank: "ai_council_rank";
    ai_council_synthesis: "ai_council_synthesis";
    ai_council_ratify: "ai_council_ratify";
    ai_council_review: "ai_council_review";
    ai_council_vote: "ai_council_vote";
}>;
export declare const AgentRuntimeKindSchema: z.ZodEnum<{
    codex_app_server: "codex_app_server";
}>;
export declare const AgentAuthModeSchema: z.ZodEnum<{
    env_secret: "env_secret";
    codex_chatgpt: "codex_chatgpt";
    openai_api_key: "openai_api_key";
    codex_chatgpt_with_api_fallback: "codex_chatgpt_with_api_fallback";
    github_access_token: "github_access_token";
}>;
export declare const WorkflowNodeDefinitionSchema: z.ZodObject<{
    id: z.ZodString;
    kind: z.ZodEnum<{
        evolution_round: "evolution_round";
        human_review: "human_review";
        noop: "noop";
        codex_session: "codex_session";
        literature_sweep: "literature_sweep";
        signal_rank: "signal_rank";
        hypothesis_generate: "hypothesis_generate";
        analysis_extract: "analysis_extract";
        dynamic_paper_patch: "dynamic_paper_patch";
        brief_generate: "brief_generate";
        artifact_publish: "artifact_publish";
    }>;
    name: z.ZodString;
    config: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
    dependsOn: z.ZodOptional<z.ZodArray<z.ZodString>>;
    runtimeProfileId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    authProfileId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strict>;
export declare const WorkflowGraphDefinitionSchema: z.ZodObject<{
    version: z.ZodLiteral<1>;
    nodes: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        kind: z.ZodEnum<{
            evolution_round: "evolution_round";
            human_review: "human_review";
            noop: "noop";
            codex_session: "codex_session";
            literature_sweep: "literature_sweep";
            signal_rank: "signal_rank";
            hypothesis_generate: "hypothesis_generate";
            analysis_extract: "analysis_extract";
            dynamic_paper_patch: "dynamic_paper_patch";
            brief_generate: "brief_generate";
            artifact_publish: "artifact_publish";
        }>;
        name: z.ZodString;
        config: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
        dependsOn: z.ZodOptional<z.ZodArray<z.ZodString>>;
        runtimeProfileId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        authProfileId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const WorkflowStepJobDataSchema: z.ZodObject<{
    runId: z.ZodString;
    runStepId: z.ZodString;
    nodeId: z.ZodString;
    attempt: z.ZodNumber;
}, z.core.$strict>;
export declare const WorkflowNormalizedErrorPayloadSchema: z.ZodObject<{
    code: z.ZodString;
}, z.core.$catchall<z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
export declare const NoopWorkflowStepOutputPayloadSchema: z.ZodObject<{
    executor: z.ZodLiteral<"noop">;
    runId: z.ZodString;
    runStepId: z.ZodString;
    nodeId: z.ZodString;
    attempt: z.ZodNumber;
}, z.core.$strict>;
export declare const CodexSessionWorkflowStepOutputPayloadSchema: z.ZodUnion<readonly [z.ZodObject<{
    executor: z.ZodLiteral<"codex_session">;
    sessionId: z.ZodString;
    workspaceId: z.ZodString;
    vmHostId: z.ZodString;
    runtimeProfileId: z.ZodString;
    authProfileId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    datasetMounts: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>;
    previousArtifactMounts: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>;
    brokerCommand: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
}, z.core.$strict>, z.ZodObject<{
    executor: z.ZodLiteral<"codex_session">;
    sessionId: z.ZodString;
    terminalSessionStatus: z.ZodLiteral<"completed">;
}, z.core.$strict>]>;
export declare const HumanReviewWorkflowStepOutputPayloadSchema: z.ZodUnion<readonly [z.ZodObject<{
    executor: z.ZodLiteral<"human_review">;
    reviewCaseId: z.ZodString;
    reviewBoardGroupId: z.ZodNumber;
    priority: z.ZodString;
    scope: z.ZodObject<{
        type: z.ZodEnum<{
            user: "user";
            domain: "domain";
            community: "community";
            group: "group";
            run: "run";
            signal: "signal";
            session: "session";
            experiment: "experiment";
            run_step: "run_step";
            boundary: "boundary";
            artifact: "artifact";
            dataset: "dataset";
            finding: "finding";
            paper: "paper";
            knowledge_source: "knowledge_source";
            sweep_job: "sweep_job";
            knowledge_document: "knowledge_document";
            knowledge_document_chunk: "knowledge_document_chunk";
            knowledge_signal: "knowledge_signal";
            science_agent_run: "science_agent_run";
            project_corpus: "project_corpus";
            hypothesis: "hypothesis";
            research_embedding: "research_embedding";
            embedding_job: "embedding_job";
            morning_brief: "morning_brief";
            dynamic_paper: "dynamic_paper";
            dynamic_paper_revision: "dynamic_paper_revision";
            dynamic_paper_section: "dynamic_paper_section";
            dynamic_paper_claim: "dynamic_paper_claim";
            dynamic_paper_evidence_link: "dynamic_paper_evidence_link";
            dynamic_paper_update: "dynamic_paper_update";
            evolution_program: "evolution_program";
            evolution_round: "evolution_round";
            evolution_candidate: "evolution_candidate";
            evolution_evaluation: "evolution_evaluation";
            evolution_archive_cell: "evolution_archive_cell";
            review_case: "review_case";
            vm: "vm";
        }>;
        id: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    executor: z.ZodLiteral<"human_review">;
    reviewCaseId: z.ZodString;
    terminalReviewCaseStatus: z.ZodLiteral<"resolved">;
}, z.core.$strict>]>;
export declare const ScienceNodeWorkflowStepOutputPayloadSchema: z.ZodUnion<readonly [z.ZodObject<{
    executor: z.ZodLiteral<"science_node_runner">;
    nodeKind: z.ZodEnum<{
        evolution_round: "evolution_round";
        human_review: "human_review";
        noop: "noop";
        codex_session: "codex_session";
        literature_sweep: "literature_sweep";
        signal_rank: "signal_rank";
        hypothesis_generate: "hypothesis_generate";
        analysis_extract: "analysis_extract";
        dynamic_paper_patch: "dynamic_paper_patch";
        brief_generate: "brief_generate";
        artifact_publish: "artifact_publish";
    }>;
    scienceAgentRunId: z.ZodString;
    runnerKind: z.ZodUnion<readonly [z.ZodEnum<{
        policy_synth_task: "policy_synth_task";
        policy_synth_waterfall: "policy_synth_waterfall";
        single_model_task: "single_model_task";
        external_job: "external_job";
    }>, z.ZodString]>;
    provider: z.ZodString;
    model: z.ZodString;
    dispatch: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
}, z.core.$strict>, z.ZodObject<{
    executor: z.ZodLiteral<"science_node_runner">;
    nodeKind: z.ZodEnum<{
        evolution_round: "evolution_round";
        human_review: "human_review";
        noop: "noop";
        codex_session: "codex_session";
        literature_sweep: "literature_sweep";
        signal_rank: "signal_rank";
        hypothesis_generate: "hypothesis_generate";
        analysis_extract: "analysis_extract";
        dynamic_paper_patch: "dynamic_paper_patch";
        brief_generate: "brief_generate";
        artifact_publish: "artifact_publish";
    }>;
    scienceAgentRunId: z.ZodString;
    runnerKind: z.ZodUnion<readonly [z.ZodEnum<{
        policy_synth_task: "policy_synth_task";
        policy_synth_waterfall: "policy_synth_waterfall";
        single_model_task: "single_model_task";
        external_job: "external_job";
    }>, z.ZodString]>;
    terminalScienceAgentRunStatus: z.ZodLiteral<"completed">;
    finalOutput: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
}, z.core.$strict>]>;
export declare const WorkflowStepOutputPayloadSchema: z.ZodUnion<readonly [z.ZodObject<{
    executor: z.ZodLiteral<"noop">;
    runId: z.ZodString;
    runStepId: z.ZodString;
    nodeId: z.ZodString;
    attempt: z.ZodNumber;
}, z.core.$strict>, z.ZodUnion<readonly [z.ZodObject<{
    executor: z.ZodLiteral<"codex_session">;
    sessionId: z.ZodString;
    workspaceId: z.ZodString;
    vmHostId: z.ZodString;
    runtimeProfileId: z.ZodString;
    authProfileId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    datasetMounts: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>;
    previousArtifactMounts: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>;
    brokerCommand: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
}, z.core.$strict>, z.ZodObject<{
    executor: z.ZodLiteral<"codex_session">;
    sessionId: z.ZodString;
    terminalSessionStatus: z.ZodLiteral<"completed">;
}, z.core.$strict>]>, z.ZodUnion<readonly [z.ZodObject<{
    executor: z.ZodLiteral<"human_review">;
    reviewCaseId: z.ZodString;
    reviewBoardGroupId: z.ZodNumber;
    priority: z.ZodString;
    scope: z.ZodObject<{
        type: z.ZodEnum<{
            user: "user";
            domain: "domain";
            community: "community";
            group: "group";
            run: "run";
            signal: "signal";
            session: "session";
            experiment: "experiment";
            run_step: "run_step";
            boundary: "boundary";
            artifact: "artifact";
            dataset: "dataset";
            finding: "finding";
            paper: "paper";
            knowledge_source: "knowledge_source";
            sweep_job: "sweep_job";
            knowledge_document: "knowledge_document";
            knowledge_document_chunk: "knowledge_document_chunk";
            knowledge_signal: "knowledge_signal";
            science_agent_run: "science_agent_run";
            project_corpus: "project_corpus";
            hypothesis: "hypothesis";
            research_embedding: "research_embedding";
            embedding_job: "embedding_job";
            morning_brief: "morning_brief";
            dynamic_paper: "dynamic_paper";
            dynamic_paper_revision: "dynamic_paper_revision";
            dynamic_paper_section: "dynamic_paper_section";
            dynamic_paper_claim: "dynamic_paper_claim";
            dynamic_paper_evidence_link: "dynamic_paper_evidence_link";
            dynamic_paper_update: "dynamic_paper_update";
            evolution_program: "evolution_program";
            evolution_round: "evolution_round";
            evolution_candidate: "evolution_candidate";
            evolution_evaluation: "evolution_evaluation";
            evolution_archive_cell: "evolution_archive_cell";
            review_case: "review_case";
            vm: "vm";
        }>;
        id: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    executor: z.ZodLiteral<"human_review">;
    reviewCaseId: z.ZodString;
    terminalReviewCaseStatus: z.ZodLiteral<"resolved">;
}, z.core.$strict>]>, z.ZodUnion<readonly [z.ZodObject<{
    executor: z.ZodLiteral<"science_node_runner">;
    nodeKind: z.ZodEnum<{
        evolution_round: "evolution_round";
        human_review: "human_review";
        noop: "noop";
        codex_session: "codex_session";
        literature_sweep: "literature_sweep";
        signal_rank: "signal_rank";
        hypothesis_generate: "hypothesis_generate";
        analysis_extract: "analysis_extract";
        dynamic_paper_patch: "dynamic_paper_patch";
        brief_generate: "brief_generate";
        artifact_publish: "artifact_publish";
    }>;
    scienceAgentRunId: z.ZodString;
    runnerKind: z.ZodUnion<readonly [z.ZodEnum<{
        policy_synth_task: "policy_synth_task";
        policy_synth_waterfall: "policy_synth_waterfall";
        single_model_task: "single_model_task";
        external_job: "external_job";
    }>, z.ZodString]>;
    provider: z.ZodString;
    model: z.ZodString;
    dispatch: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
}, z.core.$strict>, z.ZodObject<{
    executor: z.ZodLiteral<"science_node_runner">;
    nodeKind: z.ZodEnum<{
        evolution_round: "evolution_round";
        human_review: "human_review";
        noop: "noop";
        codex_session: "codex_session";
        literature_sweep: "literature_sweep";
        signal_rank: "signal_rank";
        hypothesis_generate: "hypothesis_generate";
        analysis_extract: "analysis_extract";
        dynamic_paper_patch: "dynamic_paper_patch";
        brief_generate: "brief_generate";
        artifact_publish: "artifact_publish";
    }>;
    scienceAgentRunId: z.ZodString;
    runnerKind: z.ZodUnion<readonly [z.ZodEnum<{
        policy_synth_task: "policy_synth_task";
        policy_synth_waterfall: "policy_synth_waterfall";
        single_model_task: "single_model_task";
        external_job: "external_job";
    }>, z.ZodString]>;
    terminalScienceAgentRunStatus: z.ZodLiteral<"completed">;
    finalOutput: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
}, z.core.$strict>]>]>;
export declare const WorkflowTemplateSchema: z.ZodObject<{
    id: z.ZodString;
    scope: z.ZodObject<{
        type: z.ZodEnum<{
            user: "user";
            domain: "domain";
            community: "community";
            group: "group";
            run: "run";
            signal: "signal";
            session: "session";
            experiment: "experiment";
            run_step: "run_step";
            boundary: "boundary";
            artifact: "artifact";
            dataset: "dataset";
            finding: "finding";
            paper: "paper";
            knowledge_source: "knowledge_source";
            sweep_job: "sweep_job";
            knowledge_document: "knowledge_document";
            knowledge_document_chunk: "knowledge_document_chunk";
            knowledge_signal: "knowledge_signal";
            science_agent_run: "science_agent_run";
            project_corpus: "project_corpus";
            hypothesis: "hypothesis";
            research_embedding: "research_embedding";
            embedding_job: "embedding_job";
            morning_brief: "morning_brief";
            dynamic_paper: "dynamic_paper";
            dynamic_paper_revision: "dynamic_paper_revision";
            dynamic_paper_section: "dynamic_paper_section";
            dynamic_paper_claim: "dynamic_paper_claim";
            dynamic_paper_evidence_link: "dynamic_paper_evidence_link";
            dynamic_paper_update: "dynamic_paper_update";
            evolution_program: "evolution_program";
            evolution_round: "evolution_round";
            evolution_candidate: "evolution_candidate";
            evolution_evaluation: "evolution_evaluation";
            evolution_archive_cell: "evolution_archive_cell";
            review_case: "review_case";
            vm: "vm";
        }>;
        id: z.ZodString;
    }, z.core.$strict>;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    status: z.ZodString;
    metadata: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strict>;
export declare const WorkflowTemplateRevisionSchema: z.ZodObject<{
    id: z.ZodString;
    workflowTemplateId: z.ZodString;
    revisionNo: z.ZodNumber;
    definition: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
    status: z.ZodString;
    createdByUserId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strict>;
export declare const PromptBindingSchema: z.ZodObject<{
    id: z.ZodString;
    scope: z.ZodObject<{
        type: z.ZodEnum<{
            user: "user";
            domain: "domain";
            community: "community";
            group: "group";
            run: "run";
            signal: "signal";
            session: "session";
            experiment: "experiment";
            run_step: "run_step";
            boundary: "boundary";
            artifact: "artifact";
            dataset: "dataset";
            finding: "finding";
            paper: "paper";
            knowledge_source: "knowledge_source";
            sweep_job: "sweep_job";
            knowledge_document: "knowledge_document";
            knowledge_document_chunk: "knowledge_document_chunk";
            knowledge_signal: "knowledge_signal";
            science_agent_run: "science_agent_run";
            project_corpus: "project_corpus";
            hypothesis: "hypothesis";
            research_embedding: "research_embedding";
            embedding_job: "embedding_job";
            morning_brief: "morning_brief";
            dynamic_paper: "dynamic_paper";
            dynamic_paper_revision: "dynamic_paper_revision";
            dynamic_paper_section: "dynamic_paper_section";
            dynamic_paper_claim: "dynamic_paper_claim";
            dynamic_paper_evidence_link: "dynamic_paper_evidence_link";
            dynamic_paper_update: "dynamic_paper_update";
            evolution_program: "evolution_program";
            evolution_round: "evolution_round";
            evolution_candidate: "evolution_candidate";
            evolution_evaluation: "evolution_evaluation";
            evolution_archive_cell: "evolution_archive_cell";
            review_case: "review_case";
            vm: "vm";
        }>;
        id: z.ZodString;
    }, z.core.$strict>;
    targetKind: z.ZodString;
    postId: z.ZodNumber;
    postRevisionId: z.ZodNumber;
    priority: z.ZodNumber;
    metadata: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strict>;
export declare const PromptTemplateResolutionSchema: z.ZodObject<{
    targetKind: z.ZodString;
    requestedScope: z.ZodObject<{
        type: z.ZodEnum<{
            user: "user";
            domain: "domain";
            community: "community";
            group: "group";
            run: "run";
            signal: "signal";
            session: "session";
            experiment: "experiment";
            run_step: "run_step";
            boundary: "boundary";
            artifact: "artifact";
            dataset: "dataset";
            finding: "finding";
            paper: "paper";
            knowledge_source: "knowledge_source";
            sweep_job: "sweep_job";
            knowledge_document: "knowledge_document";
            knowledge_document_chunk: "knowledge_document_chunk";
            knowledge_signal: "knowledge_signal";
            science_agent_run: "science_agent_run";
            project_corpus: "project_corpus";
            hypothesis: "hypothesis";
            research_embedding: "research_embedding";
            embedding_job: "embedding_job";
            morning_brief: "morning_brief";
            dynamic_paper: "dynamic_paper";
            dynamic_paper_revision: "dynamic_paper_revision";
            dynamic_paper_section: "dynamic_paper_section";
            dynamic_paper_claim: "dynamic_paper_claim";
            dynamic_paper_evidence_link: "dynamic_paper_evidence_link";
            dynamic_paper_update: "dynamic_paper_update";
            evolution_program: "evolution_program";
            evolution_round: "evolution_round";
            evolution_candidate: "evolution_candidate";
            evolution_evaluation: "evolution_evaluation";
            evolution_archive_cell: "evolution_archive_cell";
            review_case: "review_case";
            vm: "vm";
        }>;
        id: z.ZodString;
    }, z.core.$strict>;
    resolvedScope: z.ZodObject<{
        type: z.ZodEnum<{
            user: "user";
            domain: "domain";
            community: "community";
            group: "group";
            run: "run";
            signal: "signal";
            session: "session";
            experiment: "experiment";
            run_step: "run_step";
            boundary: "boundary";
            artifact: "artifact";
            dataset: "dataset";
            finding: "finding";
            paper: "paper";
            knowledge_source: "knowledge_source";
            sweep_job: "sweep_job";
            knowledge_document: "knowledge_document";
            knowledge_document_chunk: "knowledge_document_chunk";
            knowledge_signal: "knowledge_signal";
            science_agent_run: "science_agent_run";
            project_corpus: "project_corpus";
            hypothesis: "hypothesis";
            research_embedding: "research_embedding";
            embedding_job: "embedding_job";
            morning_brief: "morning_brief";
            dynamic_paper: "dynamic_paper";
            dynamic_paper_revision: "dynamic_paper_revision";
            dynamic_paper_section: "dynamic_paper_section";
            dynamic_paper_claim: "dynamic_paper_claim";
            dynamic_paper_evidence_link: "dynamic_paper_evidence_link";
            dynamic_paper_update: "dynamic_paper_update";
            evolution_program: "evolution_program";
            evolution_round: "evolution_round";
            evolution_candidate: "evolution_candidate";
            evolution_evaluation: "evolution_evaluation";
            evolution_archive_cell: "evolution_archive_cell";
            review_case: "review_case";
            vm: "vm";
        }>;
        id: z.ZodString;
    }, z.core.$strict>;
    bindingId: z.ZodString;
    postId: z.ZodNumber;
    postRevisionId: z.ZodNumber;
    priority: z.ZodNumber;
    name: z.ZodString;
    content: z.ZodString;
    checksumSha256: z.ZodString;
    inherited: z.ZodBoolean;
    metadata: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strict>;
export declare const PromptTemplateReferenceSchema: z.ZodObject<{
    targetKind: z.ZodString;
    requestedScope: z.ZodObject<{
        type: z.ZodEnum<{
            user: "user";
            domain: "domain";
            community: "community";
            group: "group";
            run: "run";
            signal: "signal";
            session: "session";
            experiment: "experiment";
            run_step: "run_step";
            boundary: "boundary";
            artifact: "artifact";
            dataset: "dataset";
            finding: "finding";
            paper: "paper";
            knowledge_source: "knowledge_source";
            sweep_job: "sweep_job";
            knowledge_document: "knowledge_document";
            knowledge_document_chunk: "knowledge_document_chunk";
            knowledge_signal: "knowledge_signal";
            science_agent_run: "science_agent_run";
            project_corpus: "project_corpus";
            hypothesis: "hypothesis";
            research_embedding: "research_embedding";
            embedding_job: "embedding_job";
            morning_brief: "morning_brief";
            dynamic_paper: "dynamic_paper";
            dynamic_paper_revision: "dynamic_paper_revision";
            dynamic_paper_section: "dynamic_paper_section";
            dynamic_paper_claim: "dynamic_paper_claim";
            dynamic_paper_evidence_link: "dynamic_paper_evidence_link";
            dynamic_paper_update: "dynamic_paper_update";
            evolution_program: "evolution_program";
            evolution_round: "evolution_round";
            evolution_candidate: "evolution_candidate";
            evolution_evaluation: "evolution_evaluation";
            evolution_archive_cell: "evolution_archive_cell";
            review_case: "review_case";
            vm: "vm";
        }>;
        id: z.ZodString;
    }, z.core.$strict>;
    resolvedScope: z.ZodObject<{
        type: z.ZodEnum<{
            user: "user";
            domain: "domain";
            community: "community";
            group: "group";
            run: "run";
            signal: "signal";
            session: "session";
            experiment: "experiment";
            run_step: "run_step";
            boundary: "boundary";
            artifact: "artifact";
            dataset: "dataset";
            finding: "finding";
            paper: "paper";
            knowledge_source: "knowledge_source";
            sweep_job: "sweep_job";
            knowledge_document: "knowledge_document";
            knowledge_document_chunk: "knowledge_document_chunk";
            knowledge_signal: "knowledge_signal";
            science_agent_run: "science_agent_run";
            project_corpus: "project_corpus";
            hypothesis: "hypothesis";
            research_embedding: "research_embedding";
            embedding_job: "embedding_job";
            morning_brief: "morning_brief";
            dynamic_paper: "dynamic_paper";
            dynamic_paper_revision: "dynamic_paper_revision";
            dynamic_paper_section: "dynamic_paper_section";
            dynamic_paper_claim: "dynamic_paper_claim";
            dynamic_paper_evidence_link: "dynamic_paper_evidence_link";
            dynamic_paper_update: "dynamic_paper_update";
            evolution_program: "evolution_program";
            evolution_round: "evolution_round";
            evolution_candidate: "evolution_candidate";
            evolution_evaluation: "evolution_evaluation";
            evolution_archive_cell: "evolution_archive_cell";
            review_case: "review_case";
            vm: "vm";
        }>;
        id: z.ZodString;
    }, z.core.$strict>;
    bindingId: z.ZodString;
    postId: z.ZodNumber;
    postRevisionId: z.ZodNumber;
    checksumSha256: z.ZodString;
    inherited: z.ZodBoolean;
}, z.core.$strict>;
export declare const AgentRuntimeProfileSchema: z.ZodObject<{
    id: z.ZodString;
    scope: z.ZodObject<{
        type: z.ZodEnum<{
            user: "user";
            domain: "domain";
            community: "community";
            group: "group";
            run: "run";
            signal: "signal";
            session: "session";
            experiment: "experiment";
            run_step: "run_step";
            boundary: "boundary";
            artifact: "artifact";
            dataset: "dataset";
            finding: "finding";
            paper: "paper";
            knowledge_source: "knowledge_source";
            sweep_job: "sweep_job";
            knowledge_document: "knowledge_document";
            knowledge_document_chunk: "knowledge_document_chunk";
            knowledge_signal: "knowledge_signal";
            science_agent_run: "science_agent_run";
            project_corpus: "project_corpus";
            hypothesis: "hypothesis";
            research_embedding: "research_embedding";
            embedding_job: "embedding_job";
            morning_brief: "morning_brief";
            dynamic_paper: "dynamic_paper";
            dynamic_paper_revision: "dynamic_paper_revision";
            dynamic_paper_section: "dynamic_paper_section";
            dynamic_paper_claim: "dynamic_paper_claim";
            dynamic_paper_evidence_link: "dynamic_paper_evidence_link";
            dynamic_paper_update: "dynamic_paper_update";
            evolution_program: "evolution_program";
            evolution_round: "evolution_round";
            evolution_candidate: "evolution_candidate";
            evolution_evaluation: "evolution_evaluation";
            evolution_archive_cell: "evolution_archive_cell";
            review_case: "review_case";
            vm: "vm";
        }>;
        id: z.ZodString;
    }, z.core.$strict>;
    name: z.ZodString;
    runtimeKind: z.ZodString;
    containerImage: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    modelDefaults: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    codexConfig: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
    resourcePolicy: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
    reviewPolicy: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
    metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strict>;
export declare const AgentAuthProfileSchema: z.ZodObject<{
    id: z.ZodString;
    scope: z.ZodObject<{
        type: z.ZodEnum<{
            user: "user";
            domain: "domain";
            community: "community";
            group: "group";
            run: "run";
            signal: "signal";
            session: "session";
            experiment: "experiment";
            run_step: "run_step";
            boundary: "boundary";
            artifact: "artifact";
            dataset: "dataset";
            finding: "finding";
            paper: "paper";
            knowledge_source: "knowledge_source";
            sweep_job: "sweep_job";
            knowledge_document: "knowledge_document";
            knowledge_document_chunk: "knowledge_document_chunk";
            knowledge_signal: "knowledge_signal";
            science_agent_run: "science_agent_run";
            project_corpus: "project_corpus";
            hypothesis: "hypothesis";
            research_embedding: "research_embedding";
            embedding_job: "embedding_job";
            morning_brief: "morning_brief";
            dynamic_paper: "dynamic_paper";
            dynamic_paper_revision: "dynamic_paper_revision";
            dynamic_paper_section: "dynamic_paper_section";
            dynamic_paper_claim: "dynamic_paper_claim";
            dynamic_paper_evidence_link: "dynamic_paper_evidence_link";
            dynamic_paper_update: "dynamic_paper_update";
            evolution_program: "evolution_program";
            evolution_round: "evolution_round";
            evolution_candidate: "evolution_candidate";
            evolution_evaluation: "evolution_evaluation";
            evolution_archive_cell: "evolution_archive_cell";
            review_case: "review_case";
            vm: "vm";
        }>;
        id: z.ZodString;
    }, z.core.$strict>;
    provider: z.ZodString;
    authMode: z.ZodString;
    secretRef: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    metadata: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strict>;
export declare const DomainApiKeySummarySchema: z.ZodObject<{
    authProfileId: z.ZodString;
    provider: z.ZodString;
    configured: z.ZodBoolean;
    keyLast4: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    fingerprintSha256: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    scope: z.ZodObject<{
        type: z.ZodEnum<{
            user: "user";
            domain: "domain";
            community: "community";
            group: "group";
            run: "run";
            signal: "signal";
            session: "session";
            experiment: "experiment";
            run_step: "run_step";
            boundary: "boundary";
            artifact: "artifact";
            dataset: "dataset";
            finding: "finding";
            paper: "paper";
            knowledge_source: "knowledge_source";
            sweep_job: "sweep_job";
            knowledge_document: "knowledge_document";
            knowledge_document_chunk: "knowledge_document_chunk";
            knowledge_signal: "knowledge_signal";
            science_agent_run: "science_agent_run";
            project_corpus: "project_corpus";
            hypothesis: "hypothesis";
            research_embedding: "research_embedding";
            embedding_job: "embedding_job";
            morning_brief: "morning_brief";
            dynamic_paper: "dynamic_paper";
            dynamic_paper_revision: "dynamic_paper_revision";
            dynamic_paper_section: "dynamic_paper_section";
            dynamic_paper_claim: "dynamic_paper_claim";
            dynamic_paper_evidence_link: "dynamic_paper_evidence_link";
            dynamic_paper_update: "dynamic_paper_update";
            evolution_program: "evolution_program";
            evolution_round: "evolution_round";
            evolution_candidate: "evolution_candidate";
            evolution_evaluation: "evolution_evaluation";
            evolution_archive_cell: "evolution_archive_cell";
            review_case: "review_case";
            vm: "vm";
        }>;
        id: z.ZodString;
    }, z.core.$strict>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strict>;
export declare const ApiKeyAuthOptionSchema: z.ZodObject<{
    authProfileId: z.ZodNullable<z.ZodString>;
    provider: z.ZodString;
    label: z.ZodString;
    configured: z.ZodBoolean;
    selected: z.ZodBoolean;
    scope: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        type: z.ZodEnum<{
            user: "user";
            domain: "domain";
            community: "community";
            group: "group";
            run: "run";
            signal: "signal";
            session: "session";
            experiment: "experiment";
            run_step: "run_step";
            boundary: "boundary";
            artifact: "artifact";
            dataset: "dataset";
            finding: "finding";
            paper: "paper";
            knowledge_source: "knowledge_source";
            sweep_job: "sweep_job";
            knowledge_document: "knowledge_document";
            knowledge_document_chunk: "knowledge_document_chunk";
            knowledge_signal: "knowledge_signal";
            science_agent_run: "science_agent_run";
            project_corpus: "project_corpus";
            hypothesis: "hypothesis";
            research_embedding: "research_embedding";
            embedding_job: "embedding_job";
            morning_brief: "morning_brief";
            dynamic_paper: "dynamic_paper";
            dynamic_paper_revision: "dynamic_paper_revision";
            dynamic_paper_section: "dynamic_paper_section";
            dynamic_paper_claim: "dynamic_paper_claim";
            dynamic_paper_evidence_link: "dynamic_paper_evidence_link";
            dynamic_paper_update: "dynamic_paper_update";
            evolution_program: "evolution_program";
            evolution_round: "evolution_round";
            evolution_candidate: "evolution_candidate";
            evolution_evaluation: "evolution_evaluation";
            evolution_archive_cell: "evolution_archive_cell";
            review_case: "review_case";
            vm: "vm";
        }>;
        id: z.ZodString;
    }, z.core.$strict>>>;
}, z.core.$strict>;
export declare const CodexAuthOptionKindSchema: z.ZodEnum<{
    chatgpt: "chatgpt";
    chatgpt_with_api_fallback: "chatgpt_with_api_fallback";
    api_key: "api_key";
}>;
export declare const CodexAuthOptionSchema: z.ZodObject<{
    authProfileId: z.ZodNullable<z.ZodString>;
    provider: z.ZodString;
    kind: z.ZodEnum<{
        chatgpt: "chatgpt";
        chatgpt_with_api_fallback: "chatgpt_with_api_fallback";
        api_key: "api_key";
    }>;
    label: z.ZodString;
    configured: z.ZodBoolean;
    selected: z.ZodBoolean;
    scope: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        type: z.ZodEnum<{
            user: "user";
            domain: "domain";
            community: "community";
            group: "group";
            run: "run";
            signal: "signal";
            session: "session";
            experiment: "experiment";
            run_step: "run_step";
            boundary: "boundary";
            artifact: "artifact";
            dataset: "dataset";
            finding: "finding";
            paper: "paper";
            knowledge_source: "knowledge_source";
            sweep_job: "sweep_job";
            knowledge_document: "knowledge_document";
            knowledge_document_chunk: "knowledge_document_chunk";
            knowledge_signal: "knowledge_signal";
            science_agent_run: "science_agent_run";
            project_corpus: "project_corpus";
            hypothesis: "hypothesis";
            research_embedding: "research_embedding";
            embedding_job: "embedding_job";
            morning_brief: "morning_brief";
            dynamic_paper: "dynamic_paper";
            dynamic_paper_revision: "dynamic_paper_revision";
            dynamic_paper_section: "dynamic_paper_section";
            dynamic_paper_claim: "dynamic_paper_claim";
            dynamic_paper_evidence_link: "dynamic_paper_evidence_link";
            dynamic_paper_update: "dynamic_paper_update";
            evolution_program: "evolution_program";
            evolution_round: "evolution_round";
            evolution_candidate: "evolution_candidate";
            evolution_evaluation: "evolution_evaluation";
            evolution_archive_cell: "evolution_archive_cell";
            review_case: "review_case";
            vm: "vm";
        }>;
        id: z.ZodString;
    }, z.core.$strict>>>;
    fallbackAuthProfileId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    fallbackConfigured: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const CodexChatGptConnectionSchema: z.ZodObject<{
    authProfileId: z.ZodNullable<z.ZodString>;
    provider: z.ZodString;
    connected: z.ZodBoolean;
    account: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>;
    loginStatus: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    loginId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updatedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strict>;
export declare const GroupLaunchResourcesSchema: z.ZodObject<{
    authProfiles: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        scope: z.ZodObject<{
            type: z.ZodEnum<{
                user: "user";
                domain: "domain";
                community: "community";
                group: "group";
                run: "run";
                signal: "signal";
                session: "session";
                experiment: "experiment";
                run_step: "run_step";
                boundary: "boundary";
                artifact: "artifact";
                dataset: "dataset";
                finding: "finding";
                paper: "paper";
                knowledge_source: "knowledge_source";
                sweep_job: "sweep_job";
                knowledge_document: "knowledge_document";
                knowledge_document_chunk: "knowledge_document_chunk";
                knowledge_signal: "knowledge_signal";
                science_agent_run: "science_agent_run";
                project_corpus: "project_corpus";
                hypothesis: "hypothesis";
                research_embedding: "research_embedding";
                embedding_job: "embedding_job";
                morning_brief: "morning_brief";
                dynamic_paper: "dynamic_paper";
                dynamic_paper_revision: "dynamic_paper_revision";
                dynamic_paper_section: "dynamic_paper_section";
                dynamic_paper_claim: "dynamic_paper_claim";
                dynamic_paper_evidence_link: "dynamic_paper_evidence_link";
                dynamic_paper_update: "dynamic_paper_update";
                evolution_program: "evolution_program";
                evolution_round: "evolution_round";
                evolution_candidate: "evolution_candidate";
                evolution_evaluation: "evolution_evaluation";
                evolution_archive_cell: "evolution_archive_cell";
                review_case: "review_case";
                vm: "vm";
            }>;
            id: z.ZodString;
        }, z.core.$strict>;
        provider: z.ZodString;
        authMode: z.ZodString;
        secretRef: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        metadata: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strict>>;
    chatGptConnection: z.ZodObject<{
        authProfileId: z.ZodNullable<z.ZodString>;
        provider: z.ZodString;
        connected: z.ZodBoolean;
        account: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>;
        loginStatus: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        loginId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        updatedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strict>;
    codexAuthOptions: z.ZodArray<z.ZodObject<{
        authProfileId: z.ZodNullable<z.ZodString>;
        provider: z.ZodString;
        kind: z.ZodEnum<{
            chatgpt: "chatgpt";
            chatgpt_with_api_fallback: "chatgpt_with_api_fallback";
            api_key: "api_key";
        }>;
        label: z.ZodString;
        configured: z.ZodBoolean;
        selected: z.ZodBoolean;
        scope: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            type: z.ZodEnum<{
                user: "user";
                domain: "domain";
                community: "community";
                group: "group";
                run: "run";
                signal: "signal";
                session: "session";
                experiment: "experiment";
                run_step: "run_step";
                boundary: "boundary";
                artifact: "artifact";
                dataset: "dataset";
                finding: "finding";
                paper: "paper";
                knowledge_source: "knowledge_source";
                sweep_job: "sweep_job";
                knowledge_document: "knowledge_document";
                knowledge_document_chunk: "knowledge_document_chunk";
                knowledge_signal: "knowledge_signal";
                science_agent_run: "science_agent_run";
                project_corpus: "project_corpus";
                hypothesis: "hypothesis";
                research_embedding: "research_embedding";
                embedding_job: "embedding_job";
                morning_brief: "morning_brief";
                dynamic_paper: "dynamic_paper";
                dynamic_paper_revision: "dynamic_paper_revision";
                dynamic_paper_section: "dynamic_paper_section";
                dynamic_paper_claim: "dynamic_paper_claim";
                dynamic_paper_evidence_link: "dynamic_paper_evidence_link";
                dynamic_paper_update: "dynamic_paper_update";
                evolution_program: "evolution_program";
                evolution_round: "evolution_round";
                evolution_candidate: "evolution_candidate";
                evolution_evaluation: "evolution_evaluation";
                evolution_archive_cell: "evolution_archive_cell";
                review_case: "review_case";
                vm: "vm";
            }>;
            id: z.ZodString;
        }, z.core.$strict>>>;
        fallbackAuthProfileId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        fallbackConfigured: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    runtimeProfiles: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        scope: z.ZodObject<{
            type: z.ZodEnum<{
                user: "user";
                domain: "domain";
                community: "community";
                group: "group";
                run: "run";
                signal: "signal";
                session: "session";
                experiment: "experiment";
                run_step: "run_step";
                boundary: "boundary";
                artifact: "artifact";
                dataset: "dataset";
                finding: "finding";
                paper: "paper";
                knowledge_source: "knowledge_source";
                sweep_job: "sweep_job";
                knowledge_document: "knowledge_document";
                knowledge_document_chunk: "knowledge_document_chunk";
                knowledge_signal: "knowledge_signal";
                science_agent_run: "science_agent_run";
                project_corpus: "project_corpus";
                hypothesis: "hypothesis";
                research_embedding: "research_embedding";
                embedding_job: "embedding_job";
                morning_brief: "morning_brief";
                dynamic_paper: "dynamic_paper";
                dynamic_paper_revision: "dynamic_paper_revision";
                dynamic_paper_section: "dynamic_paper_section";
                dynamic_paper_claim: "dynamic_paper_claim";
                dynamic_paper_evidence_link: "dynamic_paper_evidence_link";
                dynamic_paper_update: "dynamic_paper_update";
                evolution_program: "evolution_program";
                evolution_round: "evolution_round";
                evolution_candidate: "evolution_candidate";
                evolution_evaluation: "evolution_evaluation";
                evolution_archive_cell: "evolution_archive_cell";
                review_case: "review_case";
                vm: "vm";
            }>;
            id: z.ZodString;
        }, z.core.$strict>;
        name: z.ZodString;
        runtimeKind: z.ZodString;
        containerImage: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        modelDefaults: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
        codexConfig: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
        resourcePolicy: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
        reviewPolicy: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
        metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strict>>;
    vmHosts: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        status: z.ZodString;
        capabilities: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
        lastSeenAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        metadata: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const CodexChatGptLoginStartedSchema: z.ZodObject<{
    authProfileId: z.ZodString;
    vmHostId: z.ZodString;
    rootPath: z.ZodString;
    loginType: z.ZodLiteral<"chatgptDeviceCode">;
    loginId: z.ZodString;
    verificationUrl: z.ZodString;
    userCode: z.ZodString;
}, z.core.$strict>;
