import assert from "node:assert/strict";
import { cpSync, mkdtempSync, mkdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL("../", import.meta.url));
const vendor = path.join(root, "vendor/deepmerge");
const entry = path.join(vendor, "lib/index.cjs");
const merge = require(entry) as typeof import("../vendor/deepmerge/lib/index.cjs");
const payload = () => JSON.parse('{"__proto__":{"poisoned":true},"ordinary":1}');

function assertSafe(value: any) {
  assert.equal(Object.getPrototypeOf(value), Object.prototype);
  assert.equal(value.poisoned, undefined);
  assert.equal(Object.hasOwn(value, "__proto__"), false);
  assert.equal(({} as any).poisoned, undefined);
}

for (const clone of [true, false]) {
  test(`both merge directions reject prototype poisoning with clone=${clone}`, () => {
    for (const [target, source] of [
      [payload(), {}], [Object.create(null), payload()],
      [payload(), payload()], [{}, payload()],
    ]) {
      const result = merge(target, source, { clone });
      assertSafe(result);
      assert.equal(result.ordinary, 1);
    }
  });
}

test("nested objects, array cloning and merge.all use the same protected boundary", () => {
  assertSafe(merge({ nested: payload() }, { nested: { extra: true } }).nested);
  assertSafe(merge({ nested: Object.create(null) }, { nested: payload() }).nested);
  assertSafe(merge([payload()], [payload()])[0]);
  assertSafe(merge([payload()], [payload()])[1]);
  assertSafe(merge({}, [payload()])[0]);
  assertSafe(merge.all([payload(), { other: true }]));
});

test("dangerous-key getters and custom callbacks are never invoked", () => {
  const hostile = Object.defineProperty({}, "__proto__", {
    enumerable: true,
    get() { throw new Error("must not read __proto__"); },
  });
  const options = { customMerge(key: string) {
    assert.notEqual(key, "__proto__");
    return undefined;
  } };
  assertSafe(merge(hostile, {}, options));
  assertSafe(merge(Object.create(null), hostile, options));
  assertSafe(merge(hostile, hostile, options));
});

test("ordinary own constructor and prototype fields remain data", () => {
  const result = merge(
    { constructor: { prototype: { left: 1 } }, prototype: { left: 1 } },
    { constructor: { prototype: { right: 2 } }, prototype: { right: 2 } },
  );
  assert.deepEqual(result, {
    constructor: { prototype: { left: 1, right: 2 } },
    prototype: { left: 1, right: 2 },
  });
  assertSafe(result);
});

test("enumerable symbols merge while inherited and nonenumerable properties remain excluded", () => {
  const symbol = Symbol("__proto__");
  const hiddenSymbol = Symbol("hidden");
  const target = Object.create({ inherited: { original: true } });
  target[symbol] = { left: 1 };
  Object.defineProperty(target, "hidden", { value: 1 });
  const source = { [symbol]: { right: 2 }, inherited: { changed: true }, hidden: 2 };
  Object.defineProperty(source, hiddenSymbol, { value: true });
  const result = merge(target, source);
  assert.deepEqual(result[symbol], { left: 1, right: 2 });
  assert.equal(Object.hasOwn(result, "inherited"), false);
  assert.equal(Object.hasOwn(result, "hidden"), false);
  assert.equal(Object.hasOwn(result, hiddenSymbol), false);
  assertSafe(result);
});

test("default merges clone inputs, concatenate arrays and preserve special objects", () => {
  const date = new Date("2026-11-06T12:00:00Z");
  const regex = /example/;
  const react = { $$typeof: Symbol.for("react.element"), props: {} };
  const left = { nested: { left: 1 }, items: [{ id: 1 }] };
  const right = { nested: { right: 2 }, items: [{ id: 2 }], date, regex, react };
  const result = merge(left, right);
  assert.deepEqual(result.nested, { left: 1, right: 2 });
  assert.deepEqual(result.items, [{ id: 1 }, { id: 2 }]);
  assert.notEqual(result.nested, left.nested);
  assert.notEqual(result.items[0], left.items[0]);
  assert.notEqual(result.items[1], right.items[0]);
  assert.equal(result.date, date);
  assert.equal(result.regex, regex);
  assert.equal(result.react, react);
  assert.deepEqual(left, { nested: { left: 1 }, items: [{ id: 1 }] });
  assert.deepEqual(right.nested, { right: 2 });
});

test("clone:false and custom merge options preserve upstream reference semantics", () => {
  const child = { nested: true };
  assert.equal(merge({}, { child }, { clone: false }).child, child);
  assert.equal(merge([child], [], { clone: false })[0], child);
  const array = [child];
  assert.equal(merge([], array, { arrayMerge: (_target, source) => source }), array);
  const cloned = merge([], [payload()], {
    arrayMerge: (_target, source, options) => source.map((value) => {
      assert.equal(options!.isMergeableObject(value), true);
      return options!.cloneUnlessOtherwiseSpecified(value, options);
    }),
  });
  assertSafe(cloned[0]);
  const custom = merge({ name: { value: "A" }, normal: { left: 1 } }, { name: { value: "B" }, normal: { right: 2 } }, {
    customMerge: (key) => key === "name" ? (a, b) => `${a.value} + ${b.value}` : undefined,
  });
  assert.equal(custom.name, "A + B");
  assert.deepEqual(custom.normal, { left: 1, right: 2 });
  const instance = new (class Special { value = 42; })();
  assert.equal(merge({}, { instance }, {
    isMergeableObject: (value) => !!value && Object.getPrototypeOf(value) === Object.prototype,
  }).instance, instance);
});

test("merge.all retains empty-input, normal-merge and invalid-input behavior", () => {
  assert.deepEqual(merge.all([]), {});
  assert.deepEqual(merge.all([{ a: 1 }, { b: 2 }, { a: 3 }]), { a: 3, b: 2 });
  assert.throws(() => merge.all(null as any), /first argument should be an array/);
});

test("every installed dependent resolves the local fork", () => {
  for (const name of ["@rollup/plugin-node-resolve", "@web/dev-server", "puppeteer-extra", "puppeteer-extra-plugin-user-preferences"]) {
    const consumer = createRequire(require.resolve(name));
    assert.equal(realpathSync(consumer.resolve("deepmerge")), realpathSync(entry), name);
    assertSafe(consumer("deepmerge")(payload(), {}));
  }
});

test("the real Puppeteer preferences merger cannot inherit a poisoned target", () => {
  const preferences = require("puppeteer-extra-plugin-user-preferences")({ userPrefs: payload() });
  assertSafe(preferences.combinedPrefs);
  assert.equal(preferences.combinedPrefs.ordinary, 1);
  assert.match(preferences.data[0].value.contents, /"ordinary": 1/);
});

test("ESM default import exposes the same CommonJS callable and merge.all", async () => {
  const imported = await import(pathToFileURL(entry).href);
  assert.equal(imported.default, merge);
  assert.deepEqual(imported.default.all([{ a: 1 }, { b: 2 }]), { a: 1, b: 2 });
});

test("checked-in runtime and declarations match the type-checked TypeScript source", () => {
  const config = ts.readConfigFile(path.join(vendor, "tsconfig.json"), ts.sys.readFile);
  assert.equal(config.error, undefined);
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, vendor);
  const program = ts.createProgram(parsed.fileNames, parsed.options);
  const diagnostics = [...parsed.errors, ...ts.getPreEmitDiagnostics(program)];
  assert.equal(diagnostics.length, 0, ts.formatDiagnostics(diagnostics, {
    getCurrentDirectory: () => root, getCanonicalFileName: (name) => name, getNewLine: () => "\n",
  }));
  const emitted = new Map<string, string>();
  const result = program.emit(undefined, (name, contents) => emitted.set(name, contents));
  assert.equal(result.emitSkipped, false);
  for (const name of ["index.cjs", "index.d.cts"]) {
    const filename = path.join(vendor, "lib", name);
    assert.ok(emitted.has(filename));
    assert.equal(readFileSync(filename, "utf8"), emitted.get(filename), `Run npm run build:deepmerge and commit lib/${name}`);
  }
});

function npm(args: string[], cwd: string, cacheRoot: string) {
  return execFileSync("npm", [...args, "--offline", "--ignore-scripts", "--no-audit", "--no-fund"], {
    cwd, encoding: "utf8", timeout: 30_000, maxBuffer: 20 * 1024 * 1024,
    env: { ...process.env, npm_config_cache: path.join(cacheRoot, "cache"),
      npm_config_registry: "http://127.0.0.1:9/", npm_config_update_notifier: "false" },
  });
}

test("full and production-only installs resolve the local override with scripts disabled", () => {
  const directory = mkdtempSync(path.join(tmpdir(), "yrpri-deepmerge-install-"));
  try {
    cpSync(vendor, path.join(directory, "vendor/deepmerge"), { recursive: true });
    mkdirSync(path.join(directory, "consumer"));
    writeFileSync(path.join(directory, "consumer/package.json"), JSON.stringify({
      name: "deepmerge-consumer-fixture", version: "1.0.0", main: "index.cjs", dependencies: { deepmerge: "^4.2.2" },
    }));
    writeFileSync(path.join(directory, "consumer/index.cjs"), 'module.exports = require("deepmerge");');
    const [consumerArchive] = JSON.parse(npm(["pack", path.join(directory, "consumer"), "--pack-destination", directory, "--json"], directory, directory));
    const manifest = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
    writeFileSync(path.join(directory, "package.json"), JSON.stringify({
      name: "deepmerge-install-fixture", version: "1.0.0", private: true,
      dependencies: { "deepmerge-consumer-fixture": `file:./${consumerArchive.filename}` },
      devDependencies: { deepmerge: manifest.devDependencies.deepmerge },
      overrides: { deepmerge: manifest.overrides.deepmerge },
      bundleDependencies: manifest.bundleDependencies,
    }));
    npm(["install"], directory, directory);
    npm(["ci"], directory, directory);
    npm(["ls", "--all"], directory, directory);
    npm(["ci", "--omit=dev"], directory, directory);
    npm(["ls", "--all", "--omit=dev"], directory, directory);
    const installed = createRequire(path.join(directory, "package.json"))("deepmerge-consumer-fixture");
    assertSafe(installed(payload(), {}));
    assertSafe(installed(Object.create(null), payload()));
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("the packed fork runs inside node_modules without TypeScript or lifecycle scripts", async () => {
  const directory = mkdtempSync(path.join(tmpdir(), "yrpri-deepmerge-pack-"));
  try {
    const [archive] = JSON.parse(npm(["pack", vendor, "--pack-destination", directory, "--json"], directory, directory));
    writeFileSync(path.join(directory, "package.json"), JSON.stringify({
      name: "deepmerge-pack-fixture", version: "1.0.0", private: true,
      dependencies: { deepmerge: `file:./${archive.filename}` },
    }));
    npm(["install"], directory, directory);
    const installed = createRequire(path.join(directory, "package.json"));
    assert.match(installed.resolve("deepmerge"), /node_modules[/\\]deepmerge[/\\]lib[/\\]index\.cjs$/);
    assertSafe(installed("deepmerge")(payload(), {}));
    const esm = await import(pathToFileURL(installed.resolve("deepmerge")).href);
    assertSafe(esm.default(Object.create(null), payload()));
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("the SDK package includes the fork's source, generated files and license", () => {
  const directory = mkdtempSync(path.join(tmpdir(), "yrpri-deepmerge-sdk-"));
  try {
    const [archive] = JSON.parse(npm(["pack", "--dry-run", "--json"], root, directory));
    const files = new Set(archive.files.map((file: { path: string }) => file.path));
    const manifest = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
    assert.equal(manifest.dependencies.deepmerge, undefined, "SDK consumers must not inherit a runtime file dependency");
    assert.equal(manifest.devDependencies.deepmerge, "file:./vendor/deepmerge");
    for (const name of ["index.cts", "lib/index.cjs", "lib/index.d.cts", "package.json", "LICENSE", "README.md"]) {
      assert.ok(files.has(`vendor/deepmerge/${name}`), `Missing vendor file: ${name}`);
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
