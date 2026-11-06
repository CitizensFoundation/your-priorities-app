import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { rollup } from "rollup";
import { rollupPluginHTML } from "@web/rollup-plugin-html";
import terser from "@rollup/plugin-terser";

const require = createRequire(import.meta.url);
// Resolve each override through its consumer, including nested installations.
const dependency = (consumer: string, name: string) => createRequire(require.resolve(consumer))(name);

test("updated lodash cannot delete inherited properties through __proto__", () => {
  const lodash = dependency("dagre", "lodash");
  const prototype = { protectedValue: true };
  const value = Object.create(prototype);
  lodash.unset(value, "__proto__.protectedValue");
  assert.equal(prototype.protectedValue, true);
  value.ordinary = { removable: true };
  assert.equal(lodash.unset(value, "ordinary.removable"), true);
  assert.deepEqual(value.ordinary, {});
});

test("UUID overrides reject undersized buffers and preserve existing consumers", () => {
  for (const consumer of ["koa-proxies", "sequelize", "weaviate-ts-client"]) {
    const uuid = dependency(consumer, "uuid");
    for (const algorithm of [uuid.v3, uuid.v5]) {
      assert.throws(() => algorithm("example", algorithm.DNS, new Uint8Array(1)), RangeError);
      assert.ok(uuid.validate(algorithm("example", algorithm.DNS)));
    }
    assert.equal(uuid.version(uuid.v1()), 1);
    assert.equal(uuid.version(uuid.v4()), 4);
  }
  const { DataTypes, Utils } = require("sequelize");
  const uuid = dependency("sequelize", "uuid");
  assert.equal(uuid.version(Utils.toDefaultValue(new DataTypes.UUIDV1())), 1);
  assert.equal(uuid.version(Utils.toDefaultValue(new DataTypes.UUIDV4())), 4);
  const { generateUuid5 } = require("weaviate-ts-client");
  assert.equal(generateUuid5("example"), uuid.v5("example", uuid.v5.DNS));
  assert.equal(typeof require("koa-proxies")("/api", { target: "http://localhost:4242" }), "function");
});

test("glob overrides honor cancellation and retain file discovery", () => {
  const cwd = fileURLToPath(new URL("../", import.meta.url));
  for (const consumer of ["@web/rollup-plugin-html", "@policysynth/agents/aiModelTypes.js", "mocha"]) {
    const glob = dependency(consumer, "glob");
    assert.throws(() => glob.globSync("**/*.ts", { cwd, signal: AbortSignal.abort() }), { name: "AbortError" });
    assert.deepEqual(glob.globSync("test/translation-security.test.{js,ts}", { cwd }), ["test/translation-security.test.ts"]);
  }
});

test("the parser's minimatch override preserves globstar and negation matching", () => {
  const { minimatch, Minimatch } = dependency("@typescript-eslint/typescript-estree", "minimatch");
  assert.equal(minimatch("src/yp-app/YpAppGlobals.ts", "src/**/*.ts"), true);
  assert.equal(minimatch("src/yp-app/YpAppGlobals.ts", "src/**/*.js"), false);
  assert.equal(new Minimatch("!**/node_modules/**").match("src/yp-app/YpAppGlobals.ts"), true);
  assert.equal(new Minimatch("!**/node_modules/**").match("node_modules/example/index.ts"), false);
});

test("HTML glob inputs still bundle and minify with the updated build dependencies", async () => {
  const directory = mkdtempSync(path.join(tmpdir(), "yrpri-build-security-"));
  let bundle;
  try {
    writeFileSync(path.join(directory, "index.html"), '<!doctype html><html><body><script type="module" src="./main.js"></script></body></html>');
    writeFileSync(path.join(directory, "main.js"), "globalThis.buildCheck = (6 * 7);");
    bundle = await rollup({ plugins: [rollupPluginHTML({ input: path.join(directory, "*.html"), rootDir: directory }), terser({ maxWorkers: 1 })] });
    const { output } = await bundle.generate({ format: "es", dir: path.join(directory, "build") });
    const script = output.find((item) => item.type === "chunk");
    assert.ok(script && script.type === "chunk");
    const context = vm.createContext({});
    vm.runInContext(script.code, context);
    assert.equal(context.buildCheck, 42);
    assert.ok(output.some((item) => item.type === "asset" && item.fileName === "index.html"));
  } finally {
    await bundle?.close();
    rmSync(directory, { recursive: true, force: true });
  }
});
