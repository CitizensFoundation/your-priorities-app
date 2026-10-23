export async function run(context, input) {
    await context.progress(0, input.length, undefined, undefined, "Adding the imported numbers");
    const result = {
        count: input.length,
        total: input.reduce((sum, row) => sum + row.value, 0),
    };
    await context.artifact("totals.json", JSON.stringify(result), "application/json");
    return result;
}
