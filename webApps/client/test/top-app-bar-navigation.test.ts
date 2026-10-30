import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";

function createBar() {
  const source = readFileSync(new URL("../src/yp-app/yp-top-app-bar.ts", import.meta.url), "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2021,
      experimentalDecorators: true,
      useDefineForClassFields: false,
    },
  }).outputText;
  const template = (strings: TemplateStringsArray, ...values: unknown[]) => ({ strings, values });
  const imports: Record<string, unknown> = {
    lit: { html: template, css: template, nothing: "" },
    "lit/decorators.js": {
      customElement: () => (value: unknown) => value,
      property: () => () => {},
      state: () => () => {},
    },
    "../common/yp-base-element": { YpBaseElement: class {} },
    "../common/YpNavHelpers": { YpNavHelpers: {} },
    "@material/web/menu/menu.js": { Corner: { START_START: "start-start" } },
  };
  const module = { exports: {} as any };
  const mockedRequire = (name: string) => {
    if (name in imports) return imports[name];
    if (name.startsWith("@material/")) return {};
    throw new Error(`Unexpected navigation import: ${name}`);
  };
  vm.runInNewContext(`(function(require, module, exports) { ${output}\n })`)(mockedRequire, module, module.exports);
  const bar = new module.exports.YpTopAppBar();
  bar.domain = { id: 2, name: "Parent organization" };
  bar.breadcrumbs = [{ name: "Community for Group: Meaning of life", url: "/community/3" }];
  bar.titleString = "Meaning of life";
  bar.t = (key: string) => key;
  return bar;
}

function text(value: any): string {
  if (value == null || typeof value === "function") return "";
  if (Array.isArray(value)) return value.map(text).join("");
  if (value.strings) return value.strings.map((part: string, index: number) => part + text(value.values[index])).join("");
  return String(value);
}

for (const wide of [false, true]) {
  for (const disableArrowBasedNavigation of [false, true]) {
    test(`hidden up-navigation excludes parent labels and links (wide=${wide}, arrowless=${disableArrowBasedNavigation})`, () => {
      const bar = createBar();
      bar.wide = wide;
      bar.disableArrowBasedNavigation = disableArrowBasedNavigation;
      bar.hideBreadcrumbs = true;
      assert.equal(bar.computedBreadcrumbs.length, 0);
      assert.doesNotMatch(text(bar.render()), /Community for Group|Parent organization/);
      assert.equal(text(bar.renderBreadcrumbsDropdown()), "");
    });
  }
}

test("normal navigation preserves parent breadcrumbs", () => {
  const bar = createBar();
  bar.wide = true;
  bar.hideBreadcrumbs = false;
  assert.equal(bar.computedBreadcrumbs.length, 2);
  assert.equal(bar.computedBreadcrumbs[0].url, "/domain/2");
  assert.match(text(bar.render()), /Community for Group/);
});

test("navigation can be hidden and restored without losing its parent path", () => {
  const bar = createBar();
  bar.hideBreadcrumbs = true;
  assert.equal(bar.computedBreadcrumbs.length, 0);
  bar.hideBreadcrumbs = false;
  assert.equal(bar.computedBreadcrumbs.at(-1).url, "/community/3");
});
