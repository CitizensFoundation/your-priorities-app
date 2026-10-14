/** Opt-in browser automation; imported only by --case ui-features --drive. No API mutations. */
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, expect as playwrightExpect } from "@playwright/test";
import type { ManualConfig } from "./environment.js";
import { redactManualText } from "./environment.js";
import { waitFor, type ManualHarness } from "./harness.js";
import { browserFixture, browserGreeting } from "./interactiveBrowser.js";
import { browserFeaturesExperiment } from "./interactiveBrowserFeatures.js";
import { verifyDownload } from "./verification.js";

const expect = playwrightExpect.configure({ timeout: 30_000 });

export async function driveBrowserFeatures(
  harness: ManualHarness,
  config: ManualConfig,
  output: string,
  headed: boolean,
  signal: AbortSignal,
) {
  signal.throwIfAborted();
  const browser = await chromium.launch({ headless: !headed });
  const context = await browser.newContext({
    acceptDownloads: true,
    viewport: { width: 1440, height: 1100 },
  });
  const page = await context.newPage();
  page.setDefaultTimeout(30_000);
  const abort = () => {
    void context.close().catch(() => undefined);
  };
  signal.addEventListener("abort", abort, { once: true });
  const checks: { name: string; at: string }[] = [];
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(redactManualText(error.message)));
  page.on("response", (response) => {
    if (
      response.url().startsWith(`${harness.baseUrl}/api/`) &&
      response.status() >= 400
    )
      errors.push(`${new URL(response.url()).pathname}: ${response.status()}`);
  });
  const state = () => harness.request<YpWorkflowSnapshot>("");
  const check = async (name: string) => {
    assert.deepEqual(
      errors,
      [],
      "Browser reported an exception or failed API request",
    );
    checks.push({ name, at: new Date().toISOString() });
    await writeFile(
      path.join(output, "browser-checks.json"),
      JSON.stringify(checks, null, 2),
      { mode: 0o600 },
    );
    console.info(`[browser-features] PASS: ${name}`);
  };
  const screenshot = (name: string) =>
    page.screenshot({ path: path.join(output, name), fullPage: true });
  const button = (name: string) =>
    page.getByRole("button", { name, exact: true });
  const graph = page.locator("yp-live-workflow-graph");
  const analyze = graph
    .getByRole("group", { name: "Live workflow agents and data connections" })
    .getByRole("button", { name: "Analyze requirements", exact: true });
  const dialog = page.getByRole("dialog", {
    name: "Analyze requirements",
    exact: true,
  });
  const model = dialog.getByRole("combobox", {
    name: "Processing model",
    exact: true,
  });
  const activity = graph.getByRole("region", { name: "Agent activity" });
  const history = dialog.getByRole("region", { name: "Model history" });
  const results = page.locator("yp-live-workflow-results");
  const base = config.processingModel.id,
    alternative = config.comparisonProcessingModel!.id;
  const send = async (text: string, turn: number) => {
    let cursor = (await state()).workspace.nextEvent;
    let items = 0;
    let finished = false;
    const replies: string[] = [];
    await page
      .getByRole("textbox", {
        name: "Message Skills First Assistant",
        exact: true,
      })
      .fill(text);
    await button("Send").click();
    await expect(
      page
        .locator("yp-live-workflow-message .user")
        .getByText(text, { exact: true }),
    ).toBeVisible();
    await waitFor(
      "Codex turn completion",
      async () => {
        assert.deepEqual(errors, []);
        const { events } = await harness.request<{ events: YpWorkflowEvent[] }>(
          `/events?after=${cursor}`,
        );
        cursor = events.at(-1)?.seq ?? cursor;
        for (const event of events) {
          if (event.type !== "session.event") continue;
          if (
            ["session.error", "approval.requested"].includes(
              String(event.data.eventType),
            )
          )
            throw new Error(
              `Codex turn needs attention: ${event.data.eventType}`,
            );
          if (event.data.eventType === "item.started") items++;
          if (event.data.eventType === "message.completed")
            replies.push(
              String((event.data.payload as { text?: string }).text ?? ""),
            );
          if (event.data.eventType === "turn.completed") {
            assert.equal(
              (event.data.payload as { turn?: { status?: string } }).turn
                ?.status,
              "completed",
              "Codex turn did not succeed",
            );
            finished = true;
          }
        }
        assert.ok(items <= 120, "Codex exceeded the manual turn item limit");
        const usage = harness.codexUsage.report();
        return finished && usage.turns === turn && usage.usageComplete;
      },
      20 * 60_000,
      signal,
    );
    await expect(
      page.locator("yp-live-workflow-message .assistant").last(),
    ).toBeVisible();
    await writeFile(
      path.join(output, `chat-${turn}.txt`),
      redactManualText(`USER\n${text}\n\nASSISTANT\n${replies.join("\n\n")}`),
      { mode: 0o600 },
    );
  };
  const completed = (id: string) =>
    waitFor(
      "trial completion",
      async () => {
        assert.deepEqual(errors, []);
        const run = (await state()).runs.find((item) => item.id === id)!;
        if (["failed", "paused", "cancelled"].includes(run.status))
          throw new Error(
            `Trial ${run.status}: ${run.error ?? "see diagnostics"}`,
          );
        return run.status === "completed" && run;
      },
      45 * 60_000,
      signal,
    );
  const downloaded: {
    id: string;
    path: string;
    checksum: string;
    bytes: number;
  }[] = [];
  const download = async (asset: YpWorkflowAsset) => {
    const pending = page.waitForEvent("download");
    await page.getByRole("link", { name: asset.name, exact: true }).click();
    const file = await pending;
    assert.equal(await file.failure(), null);
    const filename = path.join(output, "browser-downloads", asset.name);
    await file.saveAs(filename);
    const bytes = await readFile(filename);
    verifyDownload(asset, bytes);
    if (asset.resultSet) {
      const rows: unknown = JSON.parse(bytes.toString());
      assert.ok(Array.isArray(rows) && rows.length === 1);
    } else assert.deepEqual(bytes, await readFile(browserFixture));
    downloaded.push({
      id: asset.id,
      path: filename,
      checksum: asset.checksum,
      bytes: bytes.length,
    });
  };
  try {
    await mkdir(path.join(output, "browser-downloads"), { recursive: true });
    await page.goto(harness.baseUrl);
    await expect(
      page.getByRole("heading", {
        name: "Talk with Skills First Assistant",
        exact: true,
      }),
    ).toBeVisible();
    await button("Use imported test key").click();
    await expect(
      page.getByText("OpenAI API key connected", { exact: true }),
    ).toBeVisible();
    await send(browserGreeting, 1);
    await check("API-key login, named assistant and rendered chat replies");

    const assistant = page.locator("yp-live-workflow-assistant-settings");
    const assistantSettings = assistant.getByRole("button", {
      name: "Assistant settings",
      exact: true,
    });
    await expect(assistant.getByRole("dialog")).toBeHidden();
    await assistantSettings.click();
    const assistantModel = assistant.getByRole("combobox", {
      name: "Assistant model",
      exact: true,
    });
    const assistantEffort = assistant.getByRole("combobox", {
      name: "Reasoning effort",
      exact: true,
    });
    const assistantSpeed = assistant.getByRole("combobox", {
      name: "Response speed",
      exact: true,
    });
    const sessionId = (await state()).workspace.sessionId;
    await assistant
      .getByRole("button", { name: "Load models", exact: true })
      .click();
    await expect(assistant.locator("datalist option").first()).toBeAttached();
    await expect(assistantModel).toHaveValue(config.codexModel);
    const changedEffort =
      config.codexReasoningEffort === "high" ? "medium" : "high";
    const changedSpeed =
      config.codexServiceTier === "fast" ? "regular" : "fast";
    await assistantModel.fill(alternative);
    await assistantEffort.selectOption(changedEffort);
    await assistantSpeed.selectOption(changedSpeed);
    await assistant
      .getByRole("button", { name: "Apply to next turn", exact: true })
      .click();
    await expect(assistant.getByText(/Saved for the next turn/)).toBeVisible();
    await page.reload();
    await assistantSettings.click();
    await expect(assistantModel).toHaveValue(alternative);
    await expect(assistantEffort).toHaveValue(changedEffort);
    await expect(assistantSpeed).toHaveValue(changedSpeed);
    assert.equal((await state()).workspace.sessionId, sessionId);
    // Exercise persistence without adding paid turns or changing the experiment's configured model.
    await assistantModel.fill(config.codexModel);
    await assistantEffort.selectOption(config.codexReasoningEffort);
    await assistantSpeed.selectOption(config.codexServiceTier);
    await assistant
      .getByRole("button", { name: "Apply to next turn", exact: true })
      .click();
    await expect(assistant.getByText(/Saved for the next turn/)).toBeVisible();
    assert.equal((await state()).workspace.sessionId, sessionId);
    await check(
      "Assistant model, reasoning and speed save, survive reload and restore without restarting the conversation",
    );

    await button("Data").click();
    await page
      .getByLabel("Upload documents or tables (250 MiB per file)", {
        exact: true,
      })
      .setInputFiles(browserFixture);
    await expect(
      page.getByRole("link", {
        name: path.basename(browserFixture),
        exact: true,
      }),
    ).toBeVisible();
    const upload = (await state()).assets.find(
      (asset) => asset.source === "upload",
    )!;
    await page
      .getByRole("row")
      .filter({
        has: page.getByRole("link", { name: upload.name, exact: true }),
      })
      .getByRole("button", { name: "Preview", exact: true })
      .click();
    await expect(
      page.getByText(
        "1 records · preview shows up to 20 records with shortened long fields.",
        { exact: true },
      ),
    ).toBeVisible();
    await download(upload);
    await check(
      "Upload, data preview, source selection and exact source download",
    );

    await button("Agents").click();
    await graph.getByRole("button", { name: "Fit", exact: true }).click();
    const fit = await graph.locator(".zoom-value").textContent();
    await graph.getByRole("button", { name: "Zoom in", exact: true }).click();
    await expect(graph.locator(".zoom-value")).not.toHaveText(fit!);
    await graph.getByRole("button", { name: "Zoom out", exact: true }).click();
    await graph.getByRole("button", { name: "Fit", exact: true }).click();
    // Start watching before sending: offline processing may finish before Codex's reply.
    const live = expect(activity.getByRole("status")).toContainText(
      /Checking|Analyzing|Detecting|Starting|Normaliz/,
      { timeout: 20 * 60_000 },
    );
    await Promise.all([send(browserFeaturesExperiment, 2), live]);
    const first = (await state()).runs[0];
    assert.ok(first);
    await completed(first.id);
    await expect(activity).toContainText("Run completed.");
    await activity.locator("summary").click();
    await expect(activity.locator("li").first()).toBeVisible();
    await activity
      .getByRole("button", { name: "Analyze requirements", exact: true })
      .first()
      .click();
    await expect(activity.locator("summary")).toContainText(
      "Analyze requirements",
    );
    await activity
      .getByRole("button", { name: "Show all agents", exact: true })
      .click();
    await screenshot("01-first-trial.png");
    await check(
      "Graph fit/zoom, live messages, completed status and activity filtering",
    );

    await button("Results").click();
    await expect(results).toContainText("1 matching results");
    await results
      .getByText("Original, evidence and full record", { exact: true })
      .click();
    await expect(results.locator("article pre")).toContainText("degrees");
    await expect(results.locator("article pre")).toContainText("evidence");
    await check(
      "First trial result, preserved source and quoted evidence details",
    );

    await button("Agents").click();
    await analyze.focus();
    await analyze.press("Enter");
    await expect(model).toBeDisabled();
    await expect(model).toHaveValue(base);
    await dialog
      .getByRole("button", { name: "Edit current draft", exact: true })
      .click();
    await model.selectOption(alternative);
    await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
    await expect(analyze).toBeFocused();
    await analyze.click();
    await expect(model).toHaveValue(base);
    await check(
      "Keyboard popup access, read-only saved run, cancel discards edits and focus restores",
    );
    await model.selectOption(alternative);
    await dialog
      .getByRole("combobox", { name: "Review model", exact: true })
      .selectOption(base);
    await dialog
      .getByRole("combobox", { name: "Agent reasoning effort", exact: true })
      .selectOption("max");
    await dialog
      .getByRole("spinbutton", {
        name: "Agent spending cap (USD, optional)",
        exact: true,
      })
      .fill("4");
    await expect(dialog).toContainText("max (agent override)");
    await expect(dialog).toContainText("output per 1M tokens");
    await screenshot("02-model-settings.png");
    await dialog
      .getByRole("button", { name: "Save agent settings", exact: true })
      .click();
    await expect(dialog).toHaveCount(0);
    await page.reload();
    await page
      .getByRole("combobox", { name: "Display", exact: true })
      .selectOption("draft");
    await analyze.click();
    await expect(model).toHaveValue(alternative);
    await expect(
      dialog.getByRole("combobox", { name: "Review model", exact: true }),
    ).toHaveValue(base);
    await expect(
      dialog.getByRole("spinbutton", {
        name: "Agent spending cap (USD, optional)",
        exact: true,
      }),
    ).toHaveValue("4");
    await history
      .getByRole("button", { name: new RegExp(first.id.slice(0, 8)) })
      .click();
    await expect(model).toHaveValue(base);
    await expect(model).toBeDisabled();
    await page.keyboard.press("Escape");
    await expect(page.locator("yp-live-workflow-message .user")).toHaveCount(2);
    await check(
      "Save persists across refresh, previous run stays unchanged and chat replays once",
    );

    await button("Data").click();
    for (const checkbox of await page
      .getByRole("checkbox", { name: /^Select / })
      .all())
      await checkbox.uncheck();
    await page
      .getByRole("checkbox", { name: `Select ${upload.name}`, exact: true })
      .check();
    await page
      .getByRole("spinbutton", { name: "Trial records", exact: true })
      .fill("1");
    await page
      .getByRole("combobox", { name: "Experiment scope", exact: true })
      .selectOption("analyze");
    await button("Agents").click();
    await button("Run 1-record trial").click();
    const second = await waitFor(
      "second trial",
      async () => (await state()).runs.find((run) => run.id !== first.id),
      60_000,
      signal,
    );
    await expect(activity).toContainText("Updates live");
    await completed(second.id);
    await expect(activity).toContainText("Run completed.");
    await page.reload();
    await page
      .getByRole("combobox", { name: "Display", exact: true })
      .selectOption(second.id);
    await analyze.click();
    await expect(model).toHaveValue(alternative);
    await expect(model).toBeDisabled();
    await expect(history.getByRole("row")).toHaveCount(3);
    await expect(history).toContainText(base);
    await expect(history).toContainText(alternative);
    await expect(history).toContainText("Cap $4.00");
    await screenshot("03-model-history.png");
    await history
      .getByRole("button", { name: new RegExp(first.id.slice(0, 8)) })
      .click();
    await expect(model).toHaveValue(base);
    await history
      .getByRole("button", { name: new RegExp(second.id.slice(0, 8)) })
      .click();
    await expect(model).toHaveValue(alternative);
    await page.keyboard.press("Escape");
    await check(
      "UI starts targeted comparison; two saved runs preserve separate models, prices and costs",
    );

    await button("Results").click();
    await expect(
      results.getByRole("combobox", { name: "Result run", exact: true }),
    ).toHaveValue(second.id);
    await results
      .getByRole("combobox", { name: "Compare with", exact: true })
      .selectOption(first.id);
    await expect(results.locator("article h4")).toHaveCount(2);
    for (const summary of await results
      .getByText("Models by agent", { exact: true })
      .all())
      await summary.click();
    await expect(results.getByRole("table").first()).toContainText(alternative);
    await expect(results.getByRole("table").last()).not.toContainText(
      alternative,
    );
    await expect(results.getByRole("table").last()).toContainText(base);
    await results
      .getByRole("textbox", { name: "Search results", exact: true })
      .fill("Library");
    await results.getByRole("button", { name: "Search", exact: true }).click();
    await expect(results).toContainText("1 matching results");
    await results
      .getByRole("combobox", { name: "Show", exact: true })
      .selectOption("failed");
    await expect(results).toContainText("0 matching results");
    await results
      .getByRole("combobox", { name: "Show", exact: true })
      .selectOption("all");
    await expect(results.locator("article h4")).toHaveCount(2);
    for (const detail of await results
      .getByText("Original, evidence and full record", { exact: true })
      .all())
      await detail.click();
    await expect(
      results.getByRole("button", { name: "Previous results", exact: true }),
    ).toBeDisabled();
    await expect(
      results.getByRole("button", { name: "Next results", exact: true }),
    ).toBeDisabled();
    await screenshot("04-results-comparison.png");
    await check(
      "Result selection, comparison, model tables, search, empty filter and pagination bounds",
    );

    await button("Usage").click();
    await expect(
      page.getByRole("heading", { name: "Processing costs", exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("table").getByRole("row")).toHaveCount(7);
    await expect(page.getByRole("table")).toContainText(`Model ${alternative}`);
    await expect(
      page
        .getByRole("table")
        .getByRole("cell", { name: "settled", exact: true }),
    ).toHaveCount(6);
    await button("Agents").click();
    await page.getByText("Package revision history", { exact: true }).click();
    await button("Load saved revisions").click();
    await button("Inspect revision").first().click();
    await expect(
      page.getByText("All files in selected revision", { exact: true }),
    ).toBeVisible();
    await button("Settings").click();
    await expect(page.getByLabel("Codex model", { exact: true })).toHaveValue(
      config.codexModel,
    );
    await page.getByText("VM storage", { exact: true }).click();
    await button("Check host disk space").click();
    await expect(page.getByText(/GiB\s+available/)).toBeVisible();
    await check(
      "Settled usage ledger, package revisions, independent Codex settings and VM storage",
    );

    await button("Data").click();
    const assets = (await state()).assets.filter((asset) => asset.resultSet);
    assert.equal(assets.length, 2);
    for (const asset of assets) await download(asset);
    await check(
      "Both browser-saved JSON results parse and match persisted checksums",
    );

    await button("Agents").click();
    await page.setViewportSize({ width: 390, height: 844 });
    await analyze.click();
    await expect(dialog).toBeVisible();
    const bounds = (await dialog.boundingBox())!;
    assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= 390);
    assert.ok(
      await dialog.evaluate(
        (element) => element.scrollWidth <= element.clientWidth,
      ),
    );
    await screenshot("05-mobile-models.png");
    await page.keyboard.press("Escape");
    await expect(analyze).toBeFocused();
    await check("Narrow-screen model popup, scrolling and keyboard dismissal");
    return {
      browserChecks: checks,
      browserDownloads: downloaded,
      automatedBrowser: true,
      realBrowser: "Chromium",
      browserOperatorConfirmedReview: false,
    };
  } catch (error) {
    await screenshot("failure.png").catch(() => undefined);
    await writeFile(
      path.join(output, "browser-error.json"),
      redactManualText(
        JSON.stringify({ error: String(error), errors }, null, 2),
      ),
      { mode: 0o600 },
    );
    throw error;
  } finally {
    signal.removeEventListener("abort", abort);
    await browser.close();
  }
}
