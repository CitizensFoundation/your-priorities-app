// Package sources are compiled separately and deliberately sit outside the API rootDir.
export async function loadAgent(name) {
    return (await import(new URL(`../../../workflow-packages/skills-first/source/${name}.ts`, import.meta.url).href)).run;
}
export async function loadEvaluator() {
    return (await import(new URL("../../../workflow-packages/skills-first/source/evaluate.ts", import.meta.url).href)).evaluate;
}
