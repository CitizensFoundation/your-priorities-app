import type { Context } from "../runner/run.js";
export type Agent = (
  context: Context,
  input: YpWorkflowJson,
) => Promise<YpWorkflowJson>;
export interface EvaluationReport {
  success: boolean;
  total: number;
  cases: { id: string; passed: boolean; issues: string[] }[];
}
// Package sources are compiled separately and deliberately sit outside the API rootDir.
export async function loadAgent(name: string): Promise<Agent> {
  return (
    await import(
      new URL(
        `../../../workflow-packages/skills-first/source/${name}.ts`,
        import.meta.url,
      ).href
    )
  ).run;
}
export async function loadEvaluator(): Promise<
  (
    dataset: unknown,
    outputs: Record<string, unknown>[],
  ) => EvaluationReport
> {
  return (
    await import(
      new URL(
        "../../../workflow-packages/skills-first/source/evaluate.ts",
        import.meta.url,
      ).href
    )
  ).evaluate;
}
