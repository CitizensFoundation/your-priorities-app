import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import resolve from "@rollup/plugin-node-resolve";
import { rollup, type Plugin } from "rollup";
import ts from "typescript";

const clientRoot = fileURLToPath(new URL("../", import.meta.url));

// Compile in memory so this check exercises current source without relying on
// previously emitted files. Dependency resolution matches the production build.
const typescript: Plugin = {
  name: "typescript-source",
  resolveId(source, importer) {
    if (!importer || !source.startsWith(".")) return null;
    const candidate = path.resolve(
      path.dirname(importer),
      source.replace(/\.js$/, ".ts"),
    );
    return existsSync(candidate) ? candidate : null;
  },
  transform(code, id) {
    if (!id.endsWith(".ts")) return null;
    return ts.transpileModule(code, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2021,
        module: ts.ModuleKind.ES2020,
        experimentalDecorators: true,
        useDefineForClassFields: false,
      },
      fileName: id,
    }).outputText;
  },
};

test("live workflows bundle as ESM without CommonJS conversion or runtime globals", async () => {
  const bundle = await rollup({
    input: path.join(clientRoot, "src/live-workflows/yp-live-workflow.ts"),
    // AOI and Your Priorities deliberately do not enable a CommonJS plugin.
    plugins: [typescript, resolve()],
    onwarn(warning) {
      if (["THIS_IS_UNDEFINED", "CIRCULAR_DEPENDENCY"].includes(warning.code!))
        return;
      throw new Error(warning.message);
    },
  });
  try {
    const { output } = await bundle.generate({ format: "es" });
    const chunks = output.filter((item) => item.type === "chunk");
    assert.ok(chunks.length > 0);
    for (const chunk of chunks) {
      assert.deepEqual(chunk.imports, []);
      assert.deepEqual(chunk.dynamicImports, []);
      assert.doesNotMatch(
        chunk.code,
        /\brequire\s*\(|\bmodule\.exports\b|\bexports\./,
      );
    }
  } finally {
    await bundle.close();
  }
});
