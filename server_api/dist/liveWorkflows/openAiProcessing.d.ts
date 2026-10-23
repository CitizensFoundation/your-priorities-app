import type { ModelDefinition } from "./modelCatalog.js";
import type { ProviderReply } from "./modelGateway.js";
/** Terminal responses can be billable without a usable answer. Never discard their receipt. */
export declare function openAiProcessingReply(value: unknown): ProviderReply;
/** The bounded host gateway needs the raw receipt before higher-level helpers reject incomplete output. */
export declare function generateOpenAiProcessing(model: ModelDefinition, apiKey: string, system: string, input: string): Promise<ProviderReply>;
