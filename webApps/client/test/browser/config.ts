import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromeLauncher, type TestRunnerConfig, type TestRunnerPlugin } from "@web/test-runner";
import ts from "typescript";

// npm run test:browser; PNGs and a gallery are written to test-results/browser/dev.
// MODE=prod uses Lit's production exports and writes a separate prod gallery.
const rootDir = fileURLToPath(new URL("../../", import.meta.url));
const mode = process.env.MODE || "dev";
if (!["dev", "prod"].includes(mode)) throw new Error(`Unknown MODE: ${mode}`);
const output = path.join(rootDir, "test-results/browser", mode);
const browser = chromeLauncher({ launchOptions: { executablePath: process.env.CHROME_PATH } });
const captures = new Set<string>();
const analysisRequests: string[] = [];

const sourcePlugin: TestRunnerPlugin = {
  name: "typescript-source",
  resolveImport({ source, context }) {
    if (!source.startsWith(".") || context.path.includes("/node_modules/")) return;
    const resolved = path.posix.resolve(path.posix.dirname(context.path), source);
    const candidate = resolved.endsWith(".js") ? resolved.slice(0, -3) + ".ts" : resolved + ".ts";
    if (existsSync(path.join(rootDir, candidate))) return candidate;
    return undefined;
  },
  transform(context) {
    if (!context.path.endsWith(".ts")) return;
    return ts.transpileModule(context.body as string, {
      fileName: context.path,
      compilerOptions: {
        module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2021,
        experimentalDecorators: true, useDefineForClassFields: false,
        sourceMap: false,
      },
    }).outputText;
  },
};

const screenshots: TestRunnerPlugin<{ name?: string }> = {
  name: "feature-screenshots",
  serverStart() {
    rmSync(output, { recursive: true, force: true });
    mkdirSync(output, { recursive: true });
  },
  async executeCommand({ command, payload, session }) {
    if (command === "reset-analysis-fixture") {
      analysisRequests.length = 0;
      return true;
    }
    if (command === "analysis-requests") return analysisRequests;
    if (command !== "feature-screenshot") return;
    const name = payload?.name;
    if (!name || !/^[a-z0-9-]+$/.test(name)) throw new Error("Invalid screenshot name");
    await browser.getPage(session.id).screenshot({ path: path.join(output, `${name}.png`) });
    captures.add(name);
    writeFileSync(path.join(output, "index.html"), `<!doctype html><html lang="en">
      <meta charset="utf-8"><title>Feature screenshots (${mode})</title>
      <style>body{font:16px system-ui;margin:32px;background:#f6f7fa;color:#172238}
      figure{margin:32px 0}img{max-width:100%;border:1px solid #ccd2de}figcaption{margin:12px 0}</style>
      <h1>Feature screenshots (${mode})</h1>
      <p>Real application components with local API fixtures. These images are review artifacts, not pixel-diff baselines.</p>
      ${[...captures].map((item) => `<figure><figcaption>${item}</figcaption><a href="${item}.png"><img src="${item}.png" alt="${item}"></a></figure>`).join("\n")}
      </html>`);
    return `${name}.png`;
  },
};

export default {
  rootDir,
  hostname: "127.0.0.2",
  files: ["test/browser/features.test.ts"],
  concurrency: 1,
  browsers: [browser],
  nodeResolve: { browser: true, exportConditions: mode === "dev" ? ["development"] : [] },
  mimeTypes: { "**/*.ts": "js" },
  plugins: [sourcePlugin, screenshots],
  testFramework: { config: { timeout: 15000 } },
  middleware: [async (context, next) => {
    if (context.path === "/api/users/has/AutoTranslation") {
      context.body = { hasAutoTranslation: false };
      return;
    }
    if (/^\/api\/allOurIdeas\/90[12]\/questions\/browser-test\/0\/1\/analysis$/.test(context.path)) {
      analysisRequests.push(context.url);
      if (context.path.includes("/901/") && analysisRequests.length === 1) {
        context.status = 503;
        context.body = { message: "Temporary analysis failure" };
      } else {
        context.body = {
          selectedChoices: [],
          ...(context.path.includes("/901/") ? {
            cachedAnalysis: "## Community priorities\n\nResidents want **safer crossings** and more trees.\n\n- Improve the school crossing\n- Plant trees along Main Street",
          } : {}),
        };
      }
      return;
    }
    await next();
  }],
  testRunnerHtml: (testRunnerImport) => `<!doctype html><html lang="en"><head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      @font-face{font-family:Roboto;src:url('/styles/fonts/Roboto-Regular.ttf') format('truetype')}
      body{margin:0;font:16px Roboto,Arial,sans-serif;background:#f6f7fa;color:#172238;
        --md-ref-typeface-plain:Roboto;--md-ref-typeface-brand:Roboto;
        --md-sys-color-primary:#244a9b;--md-sys-color-on-primary:#fff;
        --md-sys-color-surface:#fff;--md-sys-color-surface-container:#edf0f7;
        --md-sys-color-surface-container-low:#edf0f7;--md-sys-color-surface-container-highest:#e4e8f1;
        --md-sys-color-on-surface:#172238;--md-sys-color-on-surface-variant:#434b5b;
        --md-sys-color-outline:#737b8b;--md-sys-color-secondary-container:#dde5f8}
      main{box-sizing:border-box;margin:104px auto 24px;padding:24px;max-width:760px;background:white;border-radius:16px}
      h1{font-size:26px;margin:0 0 12px}p{line-height:1.6}
      yp-language-selector,aoi-streaming-analysis{display:block}
      [slot=navigation]{font-size:20px;white-space:nowrap;margin-inline-end:24px}
      @media(max-width:600px){main{margin:104px 12px 12px;padding:20px}h1{font-size:24px}}
    </style></head><body><script type="module" src="${testRunnerImport}"></script></body></html>`,
} satisfies Partial<TestRunnerConfig>;
