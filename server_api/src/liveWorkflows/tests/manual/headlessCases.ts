export const headlessCases = [
  "adapt-format",
  "codex-trial",
  "mixed-records",
  "run-controls",
  "approved-bulk",
] as const;
export type HeadlessCase = (typeof headlessCases)[number];

export function selectHeadlessCases(value: string): HeadlessCase[] {
  if (value === "all") return [...headlessCases];
  if (!(headlessCases as readonly string[]).includes(value))
    throw new Error(`Choose --case all or ${headlessCases.join(", ")}`);
  return [value as HeadlessCase];
}

/** Independent disposable workspaces share one upper bound, never one full allowance apiece. */
export function headlessCaseBudget(total: number, count: number) {
  if (
    !Number.isSafeInteger(total) ||
    total <= 0 ||
    !Number.isInteger(count) ||
    count < 1 ||
    count > headlessCases.length
  )
    throw new Error("Invalid headless suite allowance");
  const allowance = Math.floor(total / count);
  if (allowance <= 0)
    throw new Error("Allowance is too small for the selected cases");
  return allowance;
}
