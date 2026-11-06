import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";
import i18next from "i18next";
import HttpApi from "i18next-http-backend";
import ts from "typescript";

const source = readFileSync(new URL("../src/yp-app/YpAppGlobals.ts", import.meta.url), "utf8");
const output = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2021 },
}).outputText;

// Run the application's real locale lifecycle with real i18next and backend
// interpolation, replacing only the network and unrelated browser services.
function createApp({ query = "", stored = "", hostname = "example.test", localesFolder = "locales" } = {}) {
  const translation = i18next.createInstance();
  const requests: string[] = [];
  const storage = new Map(stored ? [["yp-user-locale", stored]] : []);
  const document = { documentElement: { lang: "", dir: "" } };
  const window = { location: { hostname, search: query }, appGlobals: null as any };
  const events: string[] = [];
  const timers: (() => void)[] = [];
  class Backend extends HttpApi {
    init(services: any, options: any, allOptions: any) {
      super.init(services, {
        ...options,
        request(_options: unknown, url: string, _payload: unknown, callback: any) {
          requests.push(url);
          const locale = new URL(url, "https://example.test").pathname.split("/").at(-2);
          callback(null, { status: 200, data: JSON.stringify({ greeting: `Hello from ${locale}` }) });
        },
      }, allOptions);
    }
  }
  const imports: Record<string, unknown> = {
    i18next: { default: translation },
    "i18next-http-backend": { default: Backend },
    "../common/YpCodeBaseclass.js": { YpCodeBase: class { fireGlobal(name: string) { events.push(name); } } },
    "../common/YpNavHelpers.js": { YpNavHelpers: {} },
    "./YpRecommendations.js": { YpRecommendations: class {} },
    "./YpCache.js": { YpCache: class {} },
    "./YpOffline.js": { YpOffline: class {} },
    "./YpAnalytics.js": { YpAnalytics: class {} },
    "./YpThemeManager.js": { YpThemeManager: class {} },
  };
  const module = { exports: {} as any };
  vm.runInNewContext(`(function(require, module, exports) { ${output}\n })`, {
    window, document, console, __LOCALES_DIR__: localesFolder,
    localStorage: { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => storage.set(key, value) },
    setTimeout: (callback: () => void) => timers.push(callback),
  })((name: string) => {
    if (name in imports) return imports[name];
    throw new Error(`Unexpected app import: ${name}`);
  }, module, module.exports);
  // Avoid unrelated constructor side effects; exercise the real methods below.
  const app = Object.create(module.exports.YpAppGlobals.prototype);
  window.appGlobals = app;
  app.language = "";
  app.parseQueryString();
  return {
    app, translation, requests, storage, document, events, timers,
    async start(prefix = "") {
      const initialized = new Promise<void>((resolve) => translation.on("initialized", () => resolve()));
      app.setupTranslationSystem(prefix);
      await initialized;
    },
  };
}

const unsafeLocales = [
  "en?admin=true", "en#fragment", "en\\..", "../../api", "%2e%2e%2fapi",
  "en&ns=private", "http:evil.test", "//evil.test", "en\r\nInjected", "__proto__",
  "en\n", "en\r", "en\u2028", "en\u2029", " en", "en ",
];

test("unsafe URL locales are not persisted or loaded and preserve the stored preference", async () => {
  for (const locale of unsafeLocales) {
    const fixture = createApp({ query: `?locale=${encodeURIComponent(locale)}`, stored: "is" });
    await fixture.start();
    assert.equal(fixture.storage.get("yp-user-locale"), "is", locale);
    assert.equal(fixture.app.language, "is", locale);
    assert.deepEqual(fixture.requests, ["/locales/is/translation.json", "/locales/en/translation.json"], locale);
    assert.equal(fixture.translation.t("greeting"), "Hello from is", locale);
  }
});

test("unsafe stored locales fall back to the hostname's default", async () => {
  for (const stored of unsafeLocales) {
    const fixture = createApp({ stored, hostname: "betrireykjavik.is" });
    await fixture.start();
    assert.equal(fixture.app.language, "is", stored);
    assert.deepEqual(fixture.requests, ["/locales/is/translation.json", "/locales/en/translation.json"], stored);
  }
});

for (const [input, normalized] of [["PT-BR", "pt_br"], ["zh_TW", "zh_tw"], ["sr-latin", "sr_latin"], ["mni-Mtei", "mni_mtei"], ["zh-Hant-TW", "zh_hant_tw"]]) {
  test(`valid locale ${input} loads ${normalized} and keeps English fallback`, async () => {
    const fixture = createApp({ query: `?locale=${input}`, stored: "is", localesFolder: "locales-123abc" });
    await fixture.start("https://cdn.example.test/assets");
    assert.equal(fixture.storage.get("yp-user-locale"), normalized);
    assert.equal(fixture.app.locale, normalized);
    assert.equal(fixture.document.documentElement.lang, normalized.replace(/_/g, "-"));
    assert.ok(fixture.requests.includes(`https://cdn.example.test/assets/locales-123abc/${normalized}/translation.json`));
    assert.ok(fixture.requests.includes("https://cdn.example.test/assets/locales-123abc/en/translation.json"));
    assert.equal(fixture.translation.t("greeting"), `Hello from ${normalized}`);
    assert.ok(fixture.events.includes("yp-language-loaded"));
  });
}

test("runtime locale changes reject unsafe input without changing UI state or making requests", async () => {
  const fixture = createApp();
  await fixture.start();
  fixture.requests.length = 0;
  fixture.events.length = 0;
  for (const locale of unsafeLocales) {
    fixture.app.changeLocaleIfNeeded(locale, true);
    fixture.app.changeLocaleIfNeededAfterWait(locale, true);
  }
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(fixture.requests, []);
  assert.deepEqual(fixture.events, []);
  assert.equal(fixture.app.language, "en");
  assert.equal(fixture.document.documentElement.lang, "en");
});

test("invalid locales do not schedule retries while translations are loading", () => {
  const fixture = createApp();
  for (const locale of unsafeLocales) fixture.app.changeLocaleIfNeeded(locale, true);
  assert.deepEqual(fixture.timers, []);
});

test("valid runtime changes respect stored preferences and normalize forced selections", async () => {
  const fixture = createApp({ stored: "en" });
  await fixture.start();
  fixture.requests.length = 0;
  fixture.app.changeLocaleIfNeeded("PT-BR");
  assert.deepEqual(fixture.requests, []);
  fixture.app.changeLocaleIfNeeded("PT-BR", true);
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(fixture.app.language, "pt_br");
  assert.equal(fixture.translation.t("greeting"), "Hello from pt_br");
  assert.equal(fixture.document.documentElement.lang, "pt-br");
  assert.ok(fixture.requests.includes("/locales/pt_br/translation.json"));
});

test("the backend itself rejects unsafe language and namespace URL interpolation", async () => {
  const requests: string[] = [];
  const backend = new HttpApi(null, {
    loadPath: "/locales/{{lng}}/{{ns}}.json",
    request(_options, url, _payload, callback) {
      requests.push(url);
      callback(null, { status: 200, data: "{}" });
    },
  });
  const read = (language: string, namespace: string) => new Promise((resolve) => backend.read(language, namespace, resolve));
  for (const locale of unsafeLocales) assert.ok(await read(locale, "translation"), locale);
  assert.ok(await read("en", "../private"));
  assert.deepEqual(requests, []);
  assert.equal(await read("pt_br", "translation"), null);
  assert.deepEqual(requests, ["/locales/pt_br/translation.json"]);
});

test("regional locale changes preserve AI image rate-limit messages and error events", async () => {
  const componentSource = readFileSync(new URL("../src/common/yp-generate-ai-image.ts", import.meta.url), "utf8");
  const component = ts.transpileModule(componentSource, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2021,
      experimentalDecorators: true, useDefineForClassFields: false,
    },
  }).outputText;
  const response = { error: "rate_limited", maxImagesPer24Hours: 5, usedImagesInLast24Hours: 5, nextImageAllowedAt: "2026-11-07T12:00:00Z" };
  for (const locale of ["pt-br", "en-gb", "zh-tw"]) {
    const fixture = createApp();
    await fixture.start();
    fixture.app.changeLocaleIfNeeded(locale, true);
    await new Promise((resolve) => setImmediate(resolve));
    fixture.app.activity = () => {};
    const events: { name: string; detail: any }[] = [];
    const imports: Record<string, unknown> = {
      lit: { html() {}, css() {} },
      "lit/decorators.js": {
        customElement: () => (value: unknown) => value,
        property: () => () => {}, query: () => () => {}, queryAll: () => () => {},
      },
      "./yp-base-element.js": { YpBaseElement: class {
        fire(name: string, detail: unknown) { events.push({ name, detail }); }
        t(key: string) { return key; }
      } },
      "../flexbox-literals/classes.js": { Layouts: [] },
    };
    const module = { exports: {} as any };
    vm.runInNewContext(`(function(require, module, exports) { ${component}\n })`, {
      Intl, console,
      window: { appGlobals: fixture.app, serverApi: { startGeneratingAiImage: async () => response } },
    })((name: string) => {
      if (name in imports) return imports[name];
      if (name.startsWith("@material/")) return {};
      throw new Error(`Unexpected image generator import: ${name}`);
    }, module, module.exports);
    const element = new module.exports.YpGenerateAiImage();
    await assert.doesNotReject(() => element.submit(), locale);
    const dateText = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(response.nextImageAllowedAt));
    assert.ok(element.currentError.endsWith(`${dateText}.`), locale);
    assert.equal(element.submitting, false);
    assert.equal(events[0].name, "image-generation-error");
    assert.equal(events[0].detail.error, "rate_limited");
    assert.equal(events[0].detail.message, element.currentError);
  }
});
