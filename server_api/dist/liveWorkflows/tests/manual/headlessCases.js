export const headlessCases = [
    "adapt-format",
    "codex-trial",
    "mixed-records",
    "run-controls",
    "approved-bulk",
];
export function selectHeadlessCases(value) {
    if (value === "all")
        return [...headlessCases];
    if (!headlessCases.includes(value))
        throw new Error(`Choose --case all or ${headlessCases.join(", ")}`);
    return [value];
}
/** Independent disposable workspaces share one upper bound, never one full allowance apiece. */
export function headlessCaseBudget(total, count) {
    if (!Number.isSafeInteger(total) ||
        total <= 0 ||
        !Number.isInteger(count) ||
        count < 1 ||
        count > headlessCases.length)
        throw new Error("Invalid headless suite allowance");
    const allowance = Math.floor(total / count);
    if (allowance <= 0)
        throw new Error("Allowance is too small for the selected cases");
    return allowance;
}
