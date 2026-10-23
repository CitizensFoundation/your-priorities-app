/** Restore an optional template chain only when a single, direct bypass makes
 * its insertion unambiguous. Custom branches require an explicit graph edit. */
export declare function reconnectEnabledTemplateAgents(graph: YpWorkflowGraph, previous: YpWorkflowGraph, template: YpWorkflowGraph): YpWorkflowGraph;
/** One dependency order for API approvals, trial samples, and the processing runner. */
export declare function orderedAgents(graph: YpWorkflowGraph): YpWorkflowNode[];
