/** Resolve display information against a run's saved catalog, or the current draft catalog. */
export function modelReasoning(node: YpWorkflowNode, model?: YpWorkflowModel) {
  if (node.reasoningEffort) return `${node.reasoningEffort} (agent override)`;
  if (!model) return "Default not recorded";
  if (model.reasoningEffort) return `${model.reasoningEffort} (model default)`;
  return model.reasoning ? "Provider default" : "No reasoning setting";
}

export function modelServiceTier(model?: YpWorkflowModel) {
  if (!model) return "Tier not recorded";
  if (model.inferenceType === "flex") return "Flex";
  if (model.inferenceType === "priority") return "Priority";
  return "Standard";
}

export function agentModelRoles(node: YpWorkflowNode, roles: string[] = []) {
  return [...new Set(["default", ...roles, ...Object.keys(node.models)])];
}

export function modelRoleLabel(role: string) {
  return role === "default"
    ? "Processing"
    : role.charAt(0).toUpperCase() + role.slice(1);
}
