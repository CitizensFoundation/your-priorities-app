/** Independent defaults; changing Codex never changes an agent's model selection. */
export const workflowModelDefaults: YpWorkflowModelDefaults = {
  codexModel: "gpt-6-luna",
  processingModel: "gpt-6-luna",
  codexReasoningEffort: "max",
  processingReasoningEffort: "max",
};

export function assistantSettings(
  config: YpWorkflowConfiguration,
): YpWorkflowAssistantSettings {
  return {
    model: config.codexModel,
    reasoningEffort:
      config.codexReasoningEffort ?? workflowModelDefaults.codexReasoningEffort,
    serviceTier: config.codexServiceTier ?? "regular",
  };
}
