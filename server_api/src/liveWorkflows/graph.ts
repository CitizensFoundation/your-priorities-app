import { graphSchema } from "./schemas.js";
import { ConflictError } from "./services/errors.js";

/** Restore an optional template chain only when a single, direct bypass makes
 * its insertion unambiguous. Custom branches require an explicit graph edit. */
export function reconnectEnabledTemplateAgents(
  graph: YpWorkflowGraph,
  previous: YpWorkflowGraph,
  template: YpWorkflowGraph,
): YpWorkflowGraph {
  const result = structuredClone(graph);
  const optional = new Set(
    template.nodes
      .filter((n) => n.kind === "agent" && !n.enabled)
      .map((n) => n.id),
  );
  const agent = (id: string) =>
    result.nodes.some((n) => n.id === id && n.kind === "agent");
  const sameEdge = (
    a: YpWorkflowGraph["edges"][number],
    b: YpWorkflowGraph["edges"][number],
  ) => a.source === b.source && a.target === b.target;
  for (const node of result.nodes) {
    if (
      !optional.has(node.id) ||
      !node.enabled ||
      previous.nodes.find((n) => n.id === node.id)?.enabled !== false
    )
      continue;
    const connectedIn = result.edges.some(
      (e) => e.target === node.id && agent(e.source),
    );
    const connectedOut = result.edges.some(
      (e) => e.source === node.id && agent(e.target),
    );
    if (connectedIn && connectedOut) continue;
    const component = new Set([node.id]);
    for (const id of component)
      for (const edge of template.edges) {
        if (edge.source === id && optional.has(edge.target))
          component.add(edge.target);
        if (edge.target === id && optional.has(edge.source))
          component.add(edge.source);
      }
    const edges = template.edges.filter(
      (e) =>
        (component.has(e.source) || component.has(e.target)) &&
        template.nodes.find((n) => n.id === e.source)?.kind === "agent" &&
        template.nodes.find((n) => n.id === e.target)?.kind === "agent",
    );
    const incoming = edges.filter((e) => !component.has(e.source));
    const outgoing = edges.filter((e) => !component.has(e.target));
    // A terminal or source agent has no optional middle chain to reconnect.
    if (!incoming.length || !outgoing.length) continue;
    const bypass = result.edges.find(
      (e) => e.source === incoming[0].source && e.target === outgoing[0].target,
    );
    const compatible = edges.every((e) =>
      [e.source, e.target].every(
        (id) =>
          result.nodes.find((n) => n.id === id)?.entrypoint ===
          template.nodes.find((n) => n.id === id)?.entrypoint,
      ),
    );
    const linear = [...component].every(
      (id) =>
        edges.filter((e) => e.target === id).length === 1 &&
        edges.filter((e) => e.source === id).length === 1,
    );
    const custom = result.edges.some(
      (e) =>
        (component.has(e.source) || component.has(e.target)) &&
        agent(e.source) &&
        agent(e.target) &&
        !edges.some((t) => sameEdge(e, t)),
    );
    if (
      incoming.length !== 1 ||
      outgoing.length !== 1 ||
      !bypass ||
      !compatible ||
      !linear ||
      custom
    )
      throw new ConflictError(
        `Reconnect ${node.label} to its inputs and downstream agents before enabling it. The template path cannot be restored safely in this custom graph.`,
      );
    result.edges = result.edges.filter((e) => e !== bypass);
    for (const edge of edges)
      if (!result.edges.some((e) => sameEdge(e, edge))) {
        let id = "restore-optional-0";
        for (let suffix = 1; result.edges.some((e) => e.id === id); suffix++)
          id = `restore-optional-${suffix}`;
        result.edges.push({ ...edge, id });
      }
  }
  return graphSchema.parse(result);
}

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
