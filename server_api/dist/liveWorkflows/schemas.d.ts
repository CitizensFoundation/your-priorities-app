import { z } from "zod";
export declare const money: z.ZodNumber;
export declare const reasoningEffortSchema: z.ZodEnum<{
    max: "max";
    high: "high";
    medium: "medium";
    low: "low";
    xhigh: "xhigh";
}>;
export declare const codexReasoningEffortSchema: z.ZodEnum<{
    max: "max";
    high: "high";
    medium: "medium";
    low: "low";
    xhigh: "xhigh";
    none: "none";
    minimal: "minimal";
}>;
export declare const assistantSettingsSchema: z.ZodObject<{
    model: z.ZodString;
    reasoningEffort: z.ZodEnum<{
        max: "max";
        high: "high";
        medium: "medium";
        low: "low";
        xhigh: "xhigh";
        none: "none";
        minimal: "minimal";
    }>;
    serviceTier: z.ZodEnum<{
        fast: "fast";
        regular: "regular";
    }>;
}, z.core.$strict>;
export declare const assistantSettingsUpdateSchema: z.ZodObject<{
    settings: z.ZodObject<{
        model: z.ZodString;
        reasoningEffort: z.ZodEnum<{
            max: "max";
            high: "high";
            medium: "medium";
            low: "low";
            xhigh: "xhigh";
            none: "none";
            minimal: "minimal";
        }>;
        serviceTier: z.ZodEnum<{
            fast: "fast";
            regular: "regular";
        }>;
    }, z.core.$strict>;
    expected: z.ZodObject<{
        model: z.ZodString;
        reasoningEffort: z.ZodEnum<{
            max: "max";
            high: "high";
            medium: "medium";
            low: "low";
            xhigh: "xhigh";
            none: "none";
            minimal: "minimal";
        }>;
        serviceTier: z.ZodEnum<{
            fast: "fast";
            regular: "regular";
        }>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const identifier: z.ZodString;
export declare const json: z.ZodType<YpWorkflowJson>;
export declare const nodeSchema: z.ZodObject<{
    id: z.ZodString;
    kind: z.ZodEnum<{
        connector: "connector";
        agent: "agent";
        artifact: "artifact";
    }>;
    label: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    entrypoint: z.ZodOptional<z.ZodString>;
    enabled: z.ZodBoolean;
    budgetMicros: z.ZodOptional<z.ZodNumber>;
    recordBudgetMicros: z.ZodOptional<z.ZodNumber>;
    models: z.ZodRecord<z.ZodString, z.ZodString>;
    reasoningEffort: z.ZodOptional<z.ZodEnum<{
        max: "max";
        high: "high";
        medium: "medium";
        low: "low";
        xhigh: "xhigh";
    }>>;
    configuration: z.ZodRecord<z.ZodString, z.ZodType<YpWorkflowJson, unknown, z.core.$ZodTypeInternals<YpWorkflowJson, unknown>>>;
    position: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const graphSchema: z.ZodObject<{
    nodes: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        kind: z.ZodEnum<{
            connector: "connector";
            agent: "agent";
            artifact: "artifact";
        }>;
        label: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        entrypoint: z.ZodOptional<z.ZodString>;
        enabled: z.ZodBoolean;
        budgetMicros: z.ZodOptional<z.ZodNumber>;
        recordBudgetMicros: z.ZodOptional<z.ZodNumber>;
        models: z.ZodRecord<z.ZodString, z.ZodString>;
        reasoningEffort: z.ZodOptional<z.ZodEnum<{
            max: "max";
            high: "high";
            medium: "medium";
            low: "low";
            xhigh: "xhigh";
        }>>;
        configuration: z.ZodRecord<z.ZodString, z.ZodType<YpWorkflowJson, unknown, z.core.$ZodTypeInternals<YpWorkflowJson, unknown>>>;
        position: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, z.core.$strict>;
    }, z.core.$strict>>;
    edges: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        source: z.ZodString;
        target: z.ZodString;
        label: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const configSchema: z.ZodObject<{
    packageId: z.ZodString;
    hostId: z.ZodString;
    codexModel: z.ZodDefault<z.ZodString>;
    codexReasoningEffort: z.ZodDefault<z.ZodEnum<{
        max: "max";
        high: "high";
        medium: "medium";
        low: "low";
        xhigh: "xhigh";
        none: "none";
        minimal: "minimal";
    }>>;
    codexServiceTier: z.ZodDefault<z.ZodEnum<{
        fast: "fast";
        regular: "regular";
    }>>;
    operatorIds: z.ZodArray<z.ZodNumber>;
    budgetMicros: z.ZodNumber;
    trialBudgetMicros: z.ZodDefault<z.ZodNumber>;
    quotaBytes: z.ZodDefault<z.ZodNumber>;
    concurrency: z.ZodDefault<z.ZodNumber>;
}, z.core.$strict>;
export declare const configurationUpdateSchema: z.ZodObject<{
    packageId: z.ZodString;
    hostId: z.ZodString;
    codexModel: z.ZodDefault<z.ZodString>;
    codexReasoningEffort: z.ZodDefault<z.ZodEnum<{
        max: "max";
        high: "high";
        medium: "medium";
        low: "low";
        xhigh: "xhigh";
        none: "none";
        minimal: "minimal";
    }>>;
    codexServiceTier: z.ZodDefault<z.ZodEnum<{
        fast: "fast";
        regular: "regular";
    }>>;
    operatorIds: z.ZodArray<z.ZodNumber>;
    budgetMicros: z.ZodNumber;
    trialBudgetMicros: z.ZodDefault<z.ZodNumber>;
    quotaBytes: z.ZodDefault<z.ZodNumber>;
    concurrency: z.ZodDefault<z.ZodNumber>;
    expectedAssistantSettings: z.ZodOptional<z.ZodObject<{
        model: z.ZodString;
        reasoningEffort: z.ZodEnum<{
            max: "max";
            high: "high";
            medium: "medium";
            low: "low";
            xhigh: "xhigh";
            none: "none";
            minimal: "minimal";
        }>;
        serviceTier: z.ZodEnum<{
            fast: "fast";
            regular: "regular";
        }>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const connectorSchema: z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    kind: z.ZodEnum<{
        "your-priorities": "your-priorities";
        "google-sheets": "google-sheets";
        "google-docs": "google-docs";
        "google-drive": "google-drive";
        firecrawl: "firecrawl";
    }>;
    resourceId: z.ZodString;
    writeEnabled: z.ZodBoolean;
    settings: z.ZodRecord<z.ZodString, z.ZodType<YpWorkflowJson, unknown, z.core.$ZodTypeInternals<YpWorkflowJson, unknown>>>;
}, z.core.$strict>;
export declare function canonical(value: unknown): string;
export declare function fingerprint(value: unknown): string;
export declare function safeMicros(value: number): number;
export declare function tokenCost(tokens: number, microsPerMillion: number): number;
