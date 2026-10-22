/** Aggregates persisted request units, without converting shared account balances to run usage. */
export function summarizeFirecrawlUsage(usage: YpWorkflowUsage[]) {
  const groups = new Map<
    string,
    {
      runId: string;
      nodeId: string;
      bindingId: string;
      searches: number;
      scrapes: number;
      credits: number;
      reservedCredits: number;
      unknownRequests: number;
      costMicros: number;
    }
  >();
  let legacyRequests = 0;
  for (const item of usage) {
    const credit = item.creditUsage;
    if (!credit) {
      if (item.description.startsWith("firecrawl:")) legacyRequests++;
      continue;
    }
    const key = JSON.stringify([item.runId, item.nodeId, credit.bindingId]);
    const group = groups.get(key) ?? {
      runId: item.runId,
      nodeId: item.nodeId,
      bindingId: credit.bindingId,
      searches: 0,
      scrapes: 0,
      credits: 0,
      reservedCredits: 0,
      unknownRequests: 0,
      costMicros: 0,
    };
    if (credit.operation === "search") group.searches++;
    else group.scrapes++;
    if (item.status === "settled") {
      group.credits += credit.actualCredits ?? 0;
      group.costMicros += item.actualMicros ?? 0;
      if (credit.actualCredits === undefined) group.unknownRequests++;
    } else {
      group.reservedCredits += credit.maximumCredits;
      if (item.status === "unknown") group.unknownRequests++;
    }
    groups.set(key, group);
  }
  const rows = [...groups.values()];
  return {
    rows,
    legacyRequests,
    credits: rows.reduce((sum, row) => sum + row.credits, 0),
    reservedCredits: rows.reduce((sum, row) => sum + row.reservedCredits, 0),
    unknownRequests: rows.reduce((sum, row) => sum + row.unknownRequests, 0),
  };
}
