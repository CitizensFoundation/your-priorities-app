import { graphSchema } from "./schemas.js";

/** One dependency order for API approvals, trial samples, and the processing runner. */
export function orderedAgents(graph: YpWorkflowGraph): YpWorkflowNode[] {
  graphSchema.parse(graph);
  const pending = [...graph.nodes],
    visited = new Set<string>(),
    result: YpWorkflowNode[] = [];
  while (pending.length) {
    const index = pending.findIndex((node) =>
      graph.edges
        .filter((edge) => edge.target === node.id)
        .every((edge) => visited.has(edge.source)),
    );
    if (index < 0) throw new Error("Graph contains a cycle");
    const [node] = pending.splice(index, 1);
    visited.add(node.id);
    if (node.kind === "agent" && node.enabled) result.push(node);
  }
  return result;
}
