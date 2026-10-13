export async function run(context: { artifact(name: string, content: string, type: string): Promise<void> }, input: { value: number }[]) {
  const result = { count: input.length, total: input.reduce((sum, row) => sum + row.value, 0) };
  await context.artifact("totals.json", JSON.stringify(result), "application/json");
  return result;
}
