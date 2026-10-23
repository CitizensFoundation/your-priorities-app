import { z } from "zod";
import { ISODateTimeSchema, JsonSchema, ScopeRefSchema, UUIDSchema, } from "./core.js";
import { VmHostSchema, } from "./execution.js";
export const WorkflowNodeKinds = [
    "noop",
    "codex_session",
    "human_review",
    "literature_sweep",
    "signal_rank",
    "hypothesis_generate",
    "analysis_extract",
    "dynamic_paper_patch",
    "evolution_round",
    "brief_generate",
    "artifact_publish",
];
export const ScienceNodeRunnerKinds = [
    "policy_synth_task",
    "policy_synth_waterfall",
    "single_model_task",
    "external_job",
];
export const WorkflowTemplateStatuses = ["draft", "active", "archived"];
export const WorkflowTemplateRevisionStatuses = ["draft", "published", "archived"];
export const PromptBindingTargetKinds = [
    "chief_scientist_review",
    "chief_scientist_reasoning_effort",
    "morning_brief",
    "codex_agents_md",
    "codex_skill",
    "group_final_review_agents_md",
    "code_data_review",
    "group_final_review_reviewer",
    "group_final_review_reviewer_correction",
    "group_final_review_preprint_draft",
    "group_final_review_preprint_draft_correction",
    "group_final_review_preprint_revision",
    "group_final_review_preprint_revision_correction",
    "group_final_review_council_member_system",
    "group_final_review_council_chair_system",
    "group_final_review_distill_correction",
    "group_final_review_lay_summary_correction",
    "experiment_plan_generator",
    "experiment_group_plan_generator_system",
    "experiment_group_plan_simple_review",
    "serial_experiment_planning_policy",
    "experiment_full_plan_template",
    "experiment_agents_md_template",
    "experiment_dataset_agents_md_template",
    "experiment_github_agents_md_injection",
    "experiment_research_plan_template",
    "experiment_initial_research_step_instruction",
    "paper_draft",
    "paper_review",
    "preprint_planner_review",
    "preprint_council",
    "chief_human_review_options",
    "paper_distill",
    "paper_lay_summary",
    "paper_patch",
    "literature_sweep",
    "signal_rank",
    "hypothesis_generate",
    "analysis_extract",
    "brief_generate",
    "dynamic_paper_patch",
    "evolution_round",
    "group_continuation_extract",
    "group_continuation_synthesis",
    "ai_council_draft",
    "ai_council_rank",
    "ai_council_synthesis",
    "ai_council_ratify",
    // Legacy AI Council surfaces retained for persisted model calls.
    "ai_council_review",
    "ai_council_vote",
];
export const AgentRuntimeKinds = ["codex_app_server"];
export const AgentRuntimeDockerNetworks = ["provider", "none"];
export const AgentRuntimeDockerGpuModes = ["all", "none"];
export const DefaultAgentRuntimeDockerPolicy = {
    network: "provider",
    gpus: "none",
    pidsLimit: 4096,
    nofileSoft: 1024,
    nofileHard: 4096,
    readOnlyRootFilesystem: false,
};
export const ResearcherReasoningEfforts = [
    "none",
    "minimal",
    "low",
    "medium",
    "high",
    "xhigh",
    "max",
];
/** @deprecated Use ResearcherReasoningEfforts. */
export const CodexReasoningEfforts = ResearcherReasoningEfforts;
export const WorkflowReasoningEfforts = [
    "low",
    "medium",
    "high",
    "xhigh",
    "max",
];
export const DynamicResearcherReasoningEfforts = [
    "medium",
    "high",
    "xhigh",
    "max",
];
/** @deprecated Use DynamicResearcherReasoningEfforts. */
export const DynamicCodexReasoningEfforts = DynamicResearcherReasoningEfforts;
export const ResearcherServiceTiers = [
    "regular",
    "fast",
    "flex",
];
/** @deprecated Use ResearcherServiceTiers. */
export const CodexServiceTiers = ResearcherServiceTiers;
export const ModelInferenceTypes = [
    "normal",
    "flex",
    "priority",
];
export const ProviderInferenceTypes = ["fast", "flex", "priority"];
export const ModelDefaultLanes = [
    "workflow",
    "researcher",
];
export const PolicySynthModelSurfaces = [
    "project_creation",
    "paper_generation",
    "paper_distill",
    "paper_lay_summary",
    "preprint_planner_review",
    "chief_human_review_options",
    "chief_scientist_review",
    "agent_step",
    "literature_sweep",
    "signal_rank",
    "hypothesis_generate",
    "analysis_extract",
    "brief_generate",
    "dynamic_paper_patch",
    "evolution_round",
    "group_continuation_extract",
    "group_continuation_synthesis",
    "ai_council_draft",
    "ai_council_rank",
    "ai_council_synthesis",
    "ai_council_ratify",
    // Legacy AI Council surfaces retained for persisted model calls.
    "ai_council_review",
    "ai_council_vote",
];
export const AiCouncilSurfaces = [
    "ai_council_draft",
    "ai_council_rank",
    "ai_council_synthesis",
    "ai_council_ratify",
    "group_continuation_synthesis",
];
export const AiCouncilChairSurfaces = [
    "ai_council_synthesis",
    "group_continuation_synthesis",
];
export const ModelAssignmentIds = [
    "planning.experiment",
    "review.preprint",
    "review.chief",
    "review.code_data",
    "paper.generate",
    "paper.distill",
    "paper.lay_summary",
    "paper.dynamic_patch",
    "preprint.synthesis",
    "agent.step",
    "research.literature_sweep",
    "research.signal_rank",
    "research.hypothesis_generate",
    "research.analysis_extract",
    "research.brief_generate",
    "evolution.round",
    "continuation.extract",
    "continuation.synthesis",
    "council.draft",
    "council.rank",
    "council.synthesis",
    "council.ratify",
    "infographic.design",
];
export const LegacyModelSurfaceAssignments = {
    project_creation: "planning.experiment",
    paper_generation: "paper.generate",
    paper_distill: "paper.distill",
    paper_lay_summary: "paper.lay_summary",
    preprint_planner_review: "review.preprint",
    chief_human_review_options: "review.preprint",
    chief_boot: "review.chief",
    chief_scientist_review: "review.chief",
    agent_step: "agent.step",
    literature_sweep: "research.literature_sweep",
    signal_rank: "research.signal_rank",
    hypothesis_generate: "research.hypothesis_generate",
    analysis_extract: "research.analysis_extract",
    brief_generate: "research.brief_generate",
    dynamic_paper_patch: "paper.dynamic_patch",
    evolution_round: "evolution.round",
    group_continuation_extract: "continuation.extract",
    group_continuation_synthesis: "continuation.synthesis",
    ai_council_draft: "council.draft",
    ai_council_rank: "council.rank",
    ai_council_synthesis: "council.synthesis",
    ai_council_ratify: "council.ratify",
    ai_council_review: "council.draft",
    ai_council_vote: "council.rank",
};
export const OpenAiReasoningModes = ["standard", "pro"];
export const AiCouncilRosterIds = [
    "council.default",
    "council.preprint",
    "council.continuation",
];
export const MaxAiCouncilRosterSize = 7;
export const DefaultResearcherModel = "gpt-5.5";
export const DefaultResearcherReasoningEffort = "xhigh";
export const DefaultResearcherServiceTier = "flex";
/** @deprecated Use DefaultResearcherModel. */
export const DefaultCodexModel = DefaultResearcherModel;
/** @deprecated Use DefaultResearcherReasoningEffort. */
export const DefaultCodexReasoningEffort = DefaultResearcherReasoningEffort;
/** @deprecated Use DefaultResearcherServiceTier. */
export const DefaultCodexServiceTier = DefaultResearcherServiceTier;
export const AgentAuthModes = [
    "env_secret",
    "codex_chatgpt",
    "openai_api_key",
    "codex_chatgpt_with_api_fallback",
    "github_access_token",
];
const jsonObjectSchema = z.record(z.string(), JsonSchema);
const uuidLikeSchema = UUIDSchema.refine((value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value), { message: "Expected UUID-like string" });
const dockerCpusSchema = z.union([
    z.number().positive(),
    z.string().regex(/^[0-9]+(?:\.[0-9]+)?$/).refine((value) => Number.parseFloat(value) > 0, {
        message: "cpus must be positive",
    }),
]);
export const ResearcherReasoningEffortSchema = z.enum(ResearcherReasoningEfforts);
/** @deprecated Use ResearcherReasoningEffortSchema. */
export const CodexReasoningEffortSchema = ResearcherReasoningEffortSchema;
export const DynamicResearcherReasoningEffortSchema = z.enum(DynamicResearcherReasoningEfforts);
/** @deprecated Use DynamicResearcherReasoningEffortSchema. */
export const DynamicCodexReasoningEffortSchema = DynamicResearcherReasoningEffortSchema;
export const ResearcherServiceTierSchema = z.enum(ResearcherServiceTiers);
/** @deprecated Use ResearcherServiceTierSchema. */
export const CodexServiceTierSchema = ResearcherServiceTierSchema;
export const ModelInferenceTypeSchema = z.enum(ModelInferenceTypes);
export const ModelDefaultLaneSchema = z.enum(ModelDefaultLanes);
export const PolicySynthModelSurfaceSchema = z.enum(PolicySynthModelSurfaces);
export const ModelAssignmentIdSchema = z.enum(ModelAssignmentIds);
export const AiCouncilRosterIdSchema = z.enum(AiCouncilRosterIds);
export const OpenAiReasoningModeSchema = z.enum(OpenAiReasoningModes);
export const ScienceNodeRunnerKindSchema = z.enum(ScienceNodeRunnerKinds);
export const WorkflowModelProviderOptionsSchema = z
    .object({
    openai: z
        .object({
        reasoningMode: OpenAiReasoningModeSchema.nullable().optional(),
    })
        .passthrough()
        .optional(),
    anthropic: jsonObjectSchema.optional(),
    google: jsonObjectSchema.optional(),
})
    .catchall(jsonObjectSchema);
export const WorkflowModelSelectorSchema = z
    .object({
    provider: z.string().trim().min(1).optional(),
    model: z.string().trim().min(1).optional(),
    apiModel: z.string().trim().min(1).nullable().optional(),
    inferenceType: z.union([ModelInferenceTypeSchema, z.string().trim().min(1)]).nullable().optional(),
    reasoningEffort: z.string().trim().min(1).nullable().optional(),
    providerOptions: WorkflowModelProviderOptionsSchema.optional(),
    metadata: jsonObjectSchema.optional(),
})
    .strict();
/** @deprecated Internal compatibility alias. */
export const PolicySynthModelSelectorSchema = WorkflowModelSelectorSchema;
export const WorkflowModelRosterMemberSchema = z
    .object({
    id: z.string().trim().min(1),
    label: z.string().trim().min(1).optional(),
    selector: WorkflowModelSelectorSchema,
})
    .strict();
export const WorkflowModelRosterSchema = z
    .object({
    members: z.array(WorkflowModelRosterMemberSchema).min(1).max(MaxAiCouncilRosterSize),
})
    .strict()
    .superRefine((roster, context) => {
    const memberIds = new Set();
    roster.members.forEach((member, index) => {
        if (memberIds.has(member.id)) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                message: "AI Council roster member IDs must be unique",
                path: ["members", index, "id"],
            });
        }
        memberIds.add(member.id);
        if (!member.selector.provider) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                message: "AI Council roster members require a provider",
                path: ["members", index, "selector", "provider"],
            });
        }
        if (!member.selector.model) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                message: "AI Council roster members require a model",
                path: ["members", index, "selector", "model"],
            });
        }
    });
});
export const ResearcherModelSelectorSchema = z
    .object({
    model: z.string().trim().min(1).optional(),
    reasoningEffort: z.union([ResearcherReasoningEffortSchema, z.string().trim().min(1)]).optional(),
    serviceTier: z.union([ResearcherServiceTierSchema, z.string().trim().min(1)]).optional(),
    dynamicReasoningEffort: z.boolean().optional(),
    modelProvider: z.string().trim().min(1).optional(),
    metadata: jsonObjectSchema.optional(),
})
    .passthrough();
/** @deprecated Use ResearcherModelSelectorSchema. */
export const CodexModelSelectorSchema = ResearcherModelSelectorSchema;
export const LiveWorkflowModelDefaultsSchema = z
    .object({
    workflow: z
        .object({
        default: WorkflowModelSelectorSchema.optional(),
        assignments: z.partialRecord(ModelAssignmentIdSchema, WorkflowModelSelectorSchema).optional(),
        rosters: z.partialRecord(AiCouncilRosterIdSchema, WorkflowModelRosterSchema).optional(),
    })
        .strict()
        .optional(),
    researcher: ResearcherModelSelectorSchema.optional(),
    metadata: jsonObjectSchema.optional(),
})
    .strict()
    .superRefine((defaults, context) => {
    const reviewSelector = defaults.workflow?.assignments?.["review.code_data"];
    const provider = reviewSelector?.provider;
    if (reviewSelector && !provider) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "review.code_data must declare an OpenAI-compatible provider explicitly",
            path: ["workflow", "assignments", "review.code_data", "provider"],
        });
    }
    if (provider && !isOpenAiCompatibleProvider(provider)) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "review.code_data requires an OpenAI-compatible provider",
            path: ["workflow", "assignments", "review.code_data", "provider"],
        });
    }
});
function isOpenAiCompatibleProvider(provider) {
    const compact = provider.trim().toLowerCase().replace(/[-_\s]/gu, "");
    return compact === "openai" || compact === "openairesponses";
}
export const ModelDefaultsSourceSchema = z
    .object({
    scope: ScopeRefSchema,
    defaults: LiveWorkflowModelDefaultsSchema,
})
    .strict();
export const ScopedModelDefaultsResponseSchema = z
    .object({
    scope: ScopeRefSchema,
    defaults: LiveWorkflowModelDefaultsSchema,
})
    .strict();
export const EffectiveModelDefaultsResponseSchema = ScopedModelDefaultsResponseSchema.extend({
    sourceChain: z.array(ModelDefaultsSourceSchema),
}).strict();
export const ResearcherModelSchema = z.string().trim().min(1).default(DefaultResearcherModel);
/** @deprecated Use ResearcherModelSchema. */
export const CodexModelSchema = ResearcherModelSchema;
export const ResearcherCoreModelSettingsSchema = z
    .object({
    model: ResearcherModelSchema,
    reasoningEffort: ResearcherReasoningEffortSchema.default(DefaultResearcherReasoningEffort),
    serviceTier: ResearcherServiceTierSchema.default(DefaultResearcherServiceTier),
    dynamicReasoningEffort: z.boolean().optional(),
})
    .passthrough();
/** @deprecated Use ResearcherCoreModelSettingsSchema. */
export const CodexCoreModelSettingsSchema = ResearcherCoreModelSettingsSchema;
export function normalizeResearcherModelSettings(value) {
    const record = jsonObjectSchema.parse(value ?? {});
    return ResearcherCoreModelSettingsSchema.parse(record);
}
/** @deprecated Use normalizeResearcherModelSettings. */
export const normalizeCodexModelDefaults = normalizeResearcherModelSettings;
export function normalizeResearcherModelSettingsWithLegacyConfigFallback(value, codexConfig) {
    const record = jsonObjectSchema.parse(value ?? {});
    const normalized = ResearcherCoreModelSettingsSchema.parse(record);
    const config = jsonObjectSchema.parse(codexConfig ?? {});
    if (!stringSetting(record.model) && stringSetting(config.model)) {
        const withoutDefaultModel = { ...normalized };
        delete withoutDefaultModel.model;
        return withoutDefaultModel;
    }
    return normalized;
}
/** @deprecated Historical runtime-snapshot adapter. */
export const normalizeCodexModelDefaultsWithConfigFallback = normalizeResearcherModelSettingsWithLegacyConfigFallback;
function stringSetting(value) {
    return typeof value === "string" && value.trim().length > 0 ? value : null;
}
export const AgentRuntimeDockerPolicySchema = z
    .object({
    network: z.enum(AgentRuntimeDockerNetworks).optional(),
    gpus: z.enum(AgentRuntimeDockerGpuModes).optional(),
    memoryBytes: z.number().int().positive().optional(),
    cpus: dockerCpusSchema.optional(),
    pidsLimit: z.number().int().positive().max(DefaultAgentRuntimeDockerPolicy.pidsLimit).optional(),
    nofileSoft: z.number().int().positive().max(DefaultAgentRuntimeDockerPolicy.nofileSoft).optional(),
    nofileHard: z.number().int().positive().max(DefaultAgentRuntimeDockerPolicy.nofileHard).optional(),
    readOnlyRootFilesystem: z.boolean().optional(),
})
    .strict()
    .superRefine((policy, context) => {
    const nofileSoft = policy.nofileSoft ?? DefaultAgentRuntimeDockerPolicy.nofileSoft;
    const nofileHard = policy.nofileHard ?? DefaultAgentRuntimeDockerPolicy.nofileHard;
    if (nofileHard < nofileSoft) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["nofileHard"],
            message: "nofileHard must be greater than or equal to nofileSoft",
        });
    }
});
export function normalizeAgentRuntimeDockerPolicy(value, options = {}) {
    const record = dockerPolicyRecord(value);
    const candidate = options.allowUnknownFields ? knownDockerPolicyFields(record) : { ...record };
    if (options.allowLegacyNetworkValues && "network" in candidate) {
        candidate.network = normalizeLegacyDockerNetwork(candidate.network);
    }
    const parsed = AgentRuntimeDockerPolicySchema.parse(candidate);
    return {
        ...DefaultAgentRuntimeDockerPolicy,
        ...parsed,
    };
}
function dockerPolicyRecord(value) {
    if (value === undefined || value === null) {
        return {};
    }
    if (typeof value !== "object" || Array.isArray(value)) {
        return AgentRuntimeDockerPolicySchema.parse(value);
    }
    return value;
}
function knownDockerPolicyFields(record) {
    const result = {};
    for (const key of [
        "network",
        "gpus",
        "memoryBytes",
        "cpus",
        "pidsLimit",
        "nofileSoft",
        "nofileHard",
        "readOnlyRootFilesystem",
    ]) {
        if (key in record) {
            result[key] = record[key];
        }
    }
    return result;
}
function normalizeLegacyDockerNetwork(value) {
    if (value === true || value === "enabled" || value === "bridge" || value === "restricted") {
        return "provider";
    }
    if (value === false) {
        return "none";
    }
    return value;
}
export const WorkflowNodeKindSchema = z.enum(WorkflowNodeKinds);
export const WorkflowTemplateStatusSchema = z.enum(WorkflowTemplateStatuses);
export const WorkflowTemplateRevisionStatusSchema = z.enum(WorkflowTemplateRevisionStatuses);
export const PromptBindingTargetKindSchema = z.enum(PromptBindingTargetKinds);
export const AgentRuntimeKindSchema = z.enum(AgentRuntimeKinds);
export const AgentAuthModeSchema = z.enum(AgentAuthModes);
export const WorkflowNodeDefinitionSchema = z
    .object({
    id: uuidLikeSchema,
    kind: WorkflowNodeKindSchema,
    name: z.string().min(1),
    config: z.record(z.string(), JsonSchema),
    dependsOn: z.array(uuidLikeSchema).optional(),
    runtimeProfileId: UUIDSchema.nullable().optional(),
    authProfileId: UUIDSchema.nullable().optional(),
})
    .strict();
export const WorkflowGraphDefinitionSchema = z
    .object({
    version: z.literal(1),
    nodes: z.array(WorkflowNodeDefinitionSchema),
})
    .strict()
    .superRefine((definition, ctx) => {
    const nodeIds = new Set();
    for (const [index, node] of definition.nodes.entries()) {
        if (nodeIds.has(node.id)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Duplicate workflow node id",
                path: ["nodes", index, "id"],
            });
        }
        nodeIds.add(node.id);
        const dependencyIds = new Set();
        for (const [dependencyIndex, dependencyId] of (node.dependsOn ?? []).entries()) {
            if (dependencyIds.has(dependencyId)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Duplicate workflow node dependency",
                    path: ["nodes", index, "dependsOn", dependencyIndex],
                });
            }
            dependencyIds.add(dependencyId);
        }
    }
    for (const [index, node] of definition.nodes.entries()) {
        for (const [dependencyIndex, dependencyId] of (node.dependsOn ?? []).entries()) {
            if (!nodeIds.has(dependencyId)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Workflow node dependency does not reference an existing node",
                    path: ["nodes", index, "dependsOn", dependencyIndex],
                });
            }
        }
    }
    const visiting = new Set();
    const visited = new Set();
    const byId = new Map(definition.nodes.map((node) => [node.id, node]));
    function visit(nodeId) {
        if (visited.has(nodeId)) {
            return false;
        }
        if (visiting.has(nodeId)) {
            return true;
        }
        visiting.add(nodeId);
        for (const dependencyId of byId.get(nodeId)?.dependsOn ?? []) {
            if (visit(dependencyId)) {
                return true;
            }
        }
        visiting.delete(nodeId);
        visited.add(nodeId);
        return false;
    }
    for (const node of definition.nodes) {
        if (visit(node.id)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Workflow graph contains a dependency cycle",
                path: ["nodes"],
            });
            break;
        }
    }
});
export const WorkflowStepJobDataSchema = z
    .object({
    runId: UUIDSchema,
    runStepId: UUIDSchema,
    nodeId: uuidLikeSchema,
    attempt: z.number().int().positive(),
})
    .strict();
export const WorkflowNormalizedErrorPayloadSchema = z
    .object({
    code: z.string().min(1),
})
    .catchall(JsonSchema);
export const NoopWorkflowStepOutputPayloadSchema = z
    .object({
    executor: z.literal("noop"),
    runId: UUIDSchema,
    runStepId: UUIDSchema,
    nodeId: UUIDSchema,
    attempt: z.number().int().positive(),
})
    .strict();
export const CodexSessionWorkflowStepOutputPayloadSchema = z.union([
    z
        .object({
        executor: z.literal("codex_session"),
        sessionId: UUIDSchema,
        workspaceId: UUIDSchema,
        vmHostId: UUIDSchema,
        runtimeProfileId: UUIDSchema,
        authProfileId: UUIDSchema.nullable().optional(),
        datasetMounts: z.array(jsonObjectSchema).optional(),
        previousArtifactMounts: z.array(jsonObjectSchema).optional(),
        brokerCommand: jsonObjectSchema,
    })
        .strict(),
    z
        .object({
        executor: z.literal("codex_session"),
        sessionId: UUIDSchema,
        terminalSessionStatus: z.literal("completed"),
    })
        .strict(),
]);
export const HumanReviewWorkflowStepOutputPayloadSchema = z.union([
    z
        .object({
        executor: z.literal("human_review"),
        reviewCaseId: UUIDSchema,
        reviewBoardGroupId: z.number().int().positive(),
        priority: z.string().min(1),
        scope: ScopeRefSchema,
    })
        .strict(),
    z
        .object({
        executor: z.literal("human_review"),
        reviewCaseId: UUIDSchema,
        terminalReviewCaseStatus: z.literal("resolved"),
    })
        .strict(),
]);
export const ScienceNodeWorkflowStepOutputPayloadSchema = z.union([
    z
        .object({
        executor: z.literal("science_node_runner"),
        nodeKind: WorkflowNodeKindSchema,
        scienceAgentRunId: UUIDSchema,
        runnerKind: z.union([ScienceNodeRunnerKindSchema, z.string().min(1)]),
        provider: z.string().min(1),
        model: z.string().min(1),
        dispatch: jsonObjectSchema.nullable(),
    })
        .strict(),
    z
        .object({
        executor: z.literal("science_node_runner"),
        nodeKind: WorkflowNodeKindSchema,
        scienceAgentRunId: UUIDSchema,
        runnerKind: z.union([ScienceNodeRunnerKindSchema, z.string().min(1)]),
        terminalScienceAgentRunStatus: z.literal("completed"),
        finalOutput: jsonObjectSchema,
    })
        .strict(),
]);
export const WorkflowStepOutputPayloadSchema = z.union([
    NoopWorkflowStepOutputPayloadSchema,
    CodexSessionWorkflowStepOutputPayloadSchema,
    HumanReviewWorkflowStepOutputPayloadSchema,
    ScienceNodeWorkflowStepOutputPayloadSchema,
]);
export const WorkflowTemplateSchema = z
    .object({
    id: UUIDSchema,
    scope: ScopeRefSchema,
    name: z.string().min(1),
    description: z.string().nullable().optional(),
    status: z.string().min(1),
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const WorkflowTemplateRevisionSchema = z
    .object({
    id: UUIDSchema,
    workflowTemplateId: UUIDSchema,
    revisionNo: z.number().int().positive(),
    definition: jsonObjectSchema,
    status: z.string().min(1),
    createdByUserId: z.number().int().positive().nullable().optional(),
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const PromptBindingSchema = z
    .object({
    id: UUIDSchema,
    scope: ScopeRefSchema,
    targetKind: z.string().min(1),
    postId: z.number().int().positive(),
    postRevisionId: z.number().int().positive(),
    priority: z.number().int(),
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const PromptTemplateResolutionSchema = z
    .object({
    targetKind: z.string().min(1),
    requestedScope: ScopeRefSchema,
    resolvedScope: ScopeRefSchema,
    bindingId: UUIDSchema,
    postId: z.number().int().positive(),
    postRevisionId: z.number().int().positive(),
    priority: z.number().int(),
    name: z.string(),
    content: z.string(),
    checksumSha256: z.string().length(64),
    inherited: z.boolean(),
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const PromptTemplateReferenceSchema = z
    .object({
    targetKind: z.string().min(1),
    requestedScope: ScopeRefSchema,
    resolvedScope: ScopeRefSchema,
    bindingId: UUIDSchema,
    postId: z.number().int().positive(),
    postRevisionId: z.number().int().positive(),
    checksumSha256: z.string().length(64),
    inherited: z.boolean(),
})
    .strict();
export const AgentRuntimeProfileSchema = z
    .object({
    id: UUIDSchema,
    scope: ScopeRefSchema,
    name: z.string().min(1),
    runtimeKind: z.string().min(1),
    containerImage: z.string().nullable().optional(),
    modelDefaults: jsonObjectSchema.optional(),
    codexConfig: jsonObjectSchema,
    resourcePolicy: jsonObjectSchema,
    reviewPolicy: jsonObjectSchema,
    metadata: jsonObjectSchema.default({}),
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const AgentAuthProfileSchema = z
    .object({
    id: UUIDSchema,
    scope: ScopeRefSchema,
    provider: z.string().min(1),
    authMode: z.string().min(1),
    secretRef: z.string().nullable().optional(),
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const DomainApiKeySummarySchema = z
    .object({
    authProfileId: UUIDSchema,
    provider: z.string().min(1),
    configured: z.boolean(),
    keyLast4: z.string().nullable().optional(),
    fingerprintSha256: z.string().length(64).nullable().optional(),
    scope: ScopeRefSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const ApiKeyAuthOptionSchema = z
    .object({
    authProfileId: UUIDSchema.nullable(),
    provider: z.string().min(1),
    label: z.string().min(1),
    configured: z.boolean(),
    selected: z.boolean(),
    scope: ScopeRefSchema.nullable().optional(),
})
    .strict();
export const CodexAuthOptionKindSchema = z.enum(["chatgpt", "chatgpt_with_api_fallback", "api_key"]);
export const CodexAuthOptionSchema = z
    .object({
    authProfileId: UUIDSchema.nullable(),
    provider: z.string().min(1),
    kind: CodexAuthOptionKindSchema,
    label: z.string().min(1),
    configured: z.boolean(),
    selected: z.boolean(),
    scope: ScopeRefSchema.nullable().optional(),
    fallbackAuthProfileId: UUIDSchema.nullable().optional(),
    fallbackConfigured: z.boolean().optional(),
})
    .strict();
export const CodexChatGptConnectionSchema = z
    .object({
    authProfileId: UUIDSchema.nullable(),
    provider: z.string().min(1),
    connected: z.boolean(),
    account: jsonObjectSchema.nullable().optional(),
    loginStatus: z.string().nullable().optional(),
    loginId: z.string().nullable().optional(),
    updatedAt: ISODateTimeSchema.nullable().optional(),
})
    .strict();
export const GroupLaunchResourcesSchema = z
    .object({
    authProfiles: z.array(AgentAuthProfileSchema),
    chatGptConnection: CodexChatGptConnectionSchema,
    codexAuthOptions: z.array(CodexAuthOptionSchema),
    runtimeProfiles: z.array(AgentRuntimeProfileSchema),
    vmHosts: z.array(VmHostSchema),
})
    .strict();
export const CodexChatGptLoginStartedSchema = z
    .object({
    authProfileId: UUIDSchema,
    vmHostId: UUIDSchema,
    rootPath: z.string().min(1),
    loginType: z.literal("chatgptDeviceCode"),
    loginId: z.string().min(1),
    verificationUrl: z.string().min(1),
    userCode: z.string().min(1),
})
    .strict();
