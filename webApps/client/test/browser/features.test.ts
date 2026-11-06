import { expect, fixture, fixtureCleanup, html, oneEvent, waitUntil } from "@open-wc/testing/pure";
import { executeServerCommand, sendMouse, setViewport } from "@web/test-runner-commands";
import { YpAppGlobals } from "../../src/yp-app/YpAppGlobals.js";
import { YpServerApi } from "../../src/common/YpServerApi.js";
import type { YpLanguageSelector } from "../../src/common/languages/yp-language-selector.js";
import type { YpTopAppBar } from "../../src/yp-app/yp-top-app-bar.js";
import type { AoiStreamingAnalysis } from "../../src/allOurIdeas/survey/aoi-streaming-analysis.js";
import "../../src/common/languages/yp-language-selector.js";
import "../../src/yp-app/yp-top-app-bar.js";
import "../../src/allOurIdeas/survey/aoi-streaming-analysis.js";

// Import the real elements, CSS, translations and HTTP clients. Only unrelated
// app services and the analysis socket transport are fixture data.
const originalUrl = location.href;

async function appFixture({ stored = "", locale = "" } = {}) {
  localStorage.removeItem("yp-user-locale");
  if (stored) localStorage.setItem("yp-user-locale", stored);
  const url = new URL(originalUrl);
  if (locale) url.searchParams.set("locale", locale);
  history.replaceState(null, "", url);
  const app = Object.assign(Object.create(YpAppGlobals.prototype) as YpAppGlobals, {
    language: "", haveLoadedLanguages: false, hasLlm: false,
    theme: { hasStaticTheme: false, themeDarkMode: false, themeHighContrast: false },
    activity() {},
  });
  window.appGlobals = app;
  window.serverApi = new YpServerApi();
  app.parseQueryString();
  app.setupTranslationSystem();
  await waitUntil(() => app.haveLoadedLanguages, "Translations did not load", { timeout: 5000 });
  return app;
}

async function screenshot(name: string) {
  await document.fonts.ready;
  await new Promise(requestAnimationFrame);
  await new Promise(requestAnimationFrame);
  return executeServerCommand("feature-screenshot", { name });
}

async function click(element: HTMLElement) {
  element.scrollIntoView({ block: "nearest" });
  const rect = element.getBoundingClientRect();
  expect(rect.width).to.be.greaterThan(0);
  expect(rect.height).to.be.greaterThan(0);
  await sendMouse({ type: "click", position: [Math.round(rect.x + rect.width / 2), Math.round(rect.y + rect.height / 2)] });
}

function noHorizontalOverflow() {
  expect(document.documentElement.scrollWidth).to.be.at.most(window.innerWidth);
}

beforeEach(async () => {
  await setViewport({ width: 1100, height: 740 });
  await executeServerCommand("reset-analysis-fixture");
});

afterEach(async function () {
  if (this.currentTest?.state === "failed") {
    await screenshot(`failure-${this.currentTest.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`);
  }
  fixtureCleanup();
  history.replaceState(null, "", originalUrl);
  localStorage.removeItem("yp-user-locale");
  document.documentElement.dir = "ltr";
});

it("selects Portuguese through the language menu and loads translated labels", async () => {
  const app = await appFixture();
  const main = await fixture<HTMLElement>(html`<main><h1>Language preferences</h1>
    <p>Choose the language used throughout Your Priorities.</p><yp-language-selector></yp-language-selector></main>`);
  const selector = main.querySelector<YpLanguageSelector>("yp-language-selector")!;
  await selector.updateComplete;
  const field = selector.shadowRoot!.querySelector<HTMLElement>("#textfield")!;
  await screenshot("language-english");
  const menu = selector.shadowRoot!.querySelector("md-menu")!;
  const opened = oneEvent(menu, "opened");
  await click(field);
  await opened;
  const closed = oneEvent(menu, "closed");
  await click(menu.querySelector<HTMLElement>('[data-language="pt-br"]')!);
  await closed;
  await waitUntil(() => app.locale === "pt_br", "Portuguese was not selected");
  await selector.updateComplete;
  expect(localStorage.getItem("yp-user-locale")).to.equal("pt-br");
  expect(document.documentElement.lang).to.equal("pt-br");
  expect(field.shadowRoot!.querySelector("input")!.getAttribute("aria-label")).to.equal("Selecione o idioma");
  expect(performance.getEntriesByType("resource").some((entry) => entry.name.endsWith("/locales/pt_br/translation.json"))).to.equal(true);
  noHorizontalOverflow();
  await screenshot("language-portuguese");
});

it("preserves the preferred language when a URL locale contains unsafe characters", async () => {
  const app = await appFixture({ stored: "pt_br", locale: "../../api?private=true" });
  const main = await fixture<HTMLElement>(html`<main><h1>Language preferences</h1>
    <p>Your saved language remains selected.</p><yp-language-selector></yp-language-selector></main>`);
  const selector = main.querySelector<YpLanguageSelector>("yp-language-selector")!;
  await selector.updateComplete;
  const before = performance.getEntriesByType("resource").length;
  app.changeLocaleIfNeeded("en#unexpected", true);
  await selector.updateComplete;
  expect(app.locale).to.equal("pt_br");
  expect(localStorage.getItem("yp-user-locale")).to.equal("pt_br");
  expect(document.documentElement.lang).to.equal("pt-br");
  expect(selector.shadowRoot!.querySelector("#textfield")!.shadowRoot!.querySelector("input")!.getAttribute("aria-label")).to.equal("Selecione o idioma");
  expect(performance.getEntriesByType("resource").slice(before).filter((entry) => /locales|private=true|unexpected/.test(entry.name))).to.have.length(0);
  await screenshot("language-invalid-url-preserves-preference");
});

it("renders Arabic labels and right to left layout on a narrow screen", async () => {
  await setViewport({ width: 390, height: 844 });
  await appFixture({ locale: "ar" });
  const main = await fixture<HTMLElement>(html`<main><h1>إعدادات اللغة</h1><yp-language-selector></yp-language-selector></main>`);
  const selector = main.querySelector<YpLanguageSelector>("yp-language-selector")!;
  await selector.updateComplete;
  expect(document.documentElement.dir).to.equal("rtl");
  expect(selector.rtl).to.equal(true);
  expect(selector.shadowRoot!.querySelector("#textfield")!.shadowRoot!.querySelector("input")!.getAttribute("aria-label")).to.equal("اختار اللغة");
  noHorizontalOverflow();
  await screenshot("language-arabic-mobile");
});

for (const width of [1100, 390]) {
  it(`hides and restores parent navigation without losing the route at width ${width}`, async () => {
    await setViewport({ width, height: 740 });
    await appFixture();
    const main = await fixture<HTMLElement>(html`<main>
      <yp-top-app-bar fixed titleString="City ideas" .breadcrumbs=${[{ name: "Riverdale community", url: "/community/3" }]}>
        <span slot="navigation">City ideas</span>
      </yp-top-app-bar><h1>City ideas</h1><p>Help decide how to improve our neighbourhood.</p></main>`);
    const bar = main.querySelector<YpTopAppBar>("yp-top-app-bar")!;
    await bar.updateComplete;
    if (width > 900) {
      const parent = bar.shadowRoot!.querySelector<HTMLElement>(".titleText")!;
      expect(parent.textContent).to.include("Riverdale community");
      await screenshot("navigation-desktop-visible");
      await click(parent);
      expect(location.pathname).to.equal("/community/3");
    }
    bar.hideBreadcrumbs = true;
    await bar.updateComplete;
    expect(bar.shadowRoot!.textContent).not.to.include("Riverdale community");
    expect(bar.shadowRoot!.querySelector("#breadCrumbTrigger")).to.equal(null);
    expect(main.querySelector("[slot=navigation]")!.getBoundingClientRect().width).to.be.greaterThan(0);
    noHorizontalOverflow();
    await screenshot(`navigation-${width > 900 ? "desktop" : "mobile"}-hidden`);
    bar.hideBreadcrumbs = false;
    await bar.updateComplete;
    expect(bar.computedBreadcrumbs[0].url).to.equal("/community/3");
    if (width > 900) expect(bar.shadowRoot!.querySelector(".titleText")!.textContent).to.include("Riverdale community");
  });
}

async function analysisFixture(groupId: number) {
  await appFixture();
  const main = await fixture<HTMLElement>(html`<main><h1>Community analysis</h1>
    <p>What matters most to residents?</p>
    <aoi-streaming-analysis .disableWebsockets=${true} .groupId=${groupId}
      .analysisIndex=${0} .analysisTypeIndex=${1}></aoi-streaming-analysis></main>`);
  const element = main.querySelector<AoiStreamingAnalysis>("aoi-streaming-analysis")!;
  Object.assign(element, { ws: { readyState: WebSocket.OPEN }, wsClientId: "browser-test" });
  element.dispatchEvent(new Event("yp-ws-opened"));
  return element;
}

it("shows an HTTP failure then recovers formatted analysis through the Retry button", async () => {
  const element = await analysisFixture(901);
  await waitUntil(() => element.analysisError, "HTTP failure was not shown");
  await element.updateComplete;
  expect(element.shadowRoot!.querySelector('[role="alert"]')!.textContent).to.include("An error occurred");
  await screenshot("analysis-error");
  await click(element.shadowRoot!.querySelector<HTMLElement>("md-text-button")!);
  await waitUntil(() => !!element.shadowRoot!.querySelector("h2"), "Retry did not render cached Markdown");
  expect(element.shadowRoot!.querySelector('[role="alert"]')).to.equal(null);
  expect(element.shadowRoot!.querySelector("h2")!.textContent).to.equal("Community priorities");
  expect(element.shadowRoot!.querySelector("strong")!.textContent).to.equal("safer crossings");
  expect(element.shadowRoot!.querySelectorAll("li")).to.have.length(2);
  expect(element.shadowRoot!.querySelector(".generatingInfo")!.hasAttribute("hidden")).to.equal(false);
  const requests = await executeServerCommand<string[], undefined>("analysis-requests");
  expect(requests).to.have.length(2);
  const tokens = requests.map((url) => new URL(url, location.origin).searchParams.get("requestId"));
  expect(tokens[0]).to.be.a("string").and.not.empty;
  expect(tokens[1]).not.to.equal(tokens[0]);
  await screenshot("analysis-retry-success");
});

it("keeps stale stream messages out of the visible result after retry", async () => {
  const element = await analysisFixture(902);
  await waitUntil(() => !!element.analysisStreamToken, "Analysis did not start");
  const send = async (type: string, token: string, message = "") => {
    await element.onMessage(new MessageEvent("message", { data: JSON.stringify({ sender: "assistant", type, uniqueToken: token, message }) }));
    await element.updateComplete;
  };
  const oldToken = element.analysisStreamToken!;
  await send("start", oldToken);
  await send("stream", oldToken, "Partial response from the first attempt.");
  await send("error", oldToken);
  await click(element.shadowRoot!.querySelector<HTMLElement>("md-text-button")!);
  await waitUntil(() => element.analysisStreamToken !== oldToken, "Retry did not start a new stream");
  const newToken = element.analysisStreamToken!;
  await send("start", newToken);
  await send("stream", newToken, "## Safer streets\n\nResidents prioritise safe walking routes.");
  for (const type of ["start", "stream", "error", "end"]) await send(type, oldToken, "STALE CONTENT");
  expect(element.shadowRoot!.querySelector(".analysisText")!.textContent).to.include("Residents prioritise safe walking routes.");
  expect(element.shadowRoot!.textContent).not.to.match(/STALE CONTENT|Partial response/);
  expect(element.shadowRoot!.querySelector('[role="alert"]')).to.equal(null);
  expect(element.isStreaming).to.equal(true);
  await screenshot("analysis-streaming-after-retry");
  await send("end", newToken);
  await waitUntil(() => element.shadowRoot!.querySelector("h2")?.textContent === "Safer streets");
  expect(element.shadowRoot!.querySelector(".analysisText")).to.equal(null);
  await screenshot("analysis-stream-complete");
});
