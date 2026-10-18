import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, expect as playwrightExpect } from "@playwright/test";
import { waitFor, type ManualHarness } from "./harness.js";
import type { UsageReservation } from "../../budget.js";
import { verifyDownload } from "./verification.js";
import { verifyIdahoResearch } from "./idahoResearch.js";
import { verifySkillsFirstValues } from "./skillsFirstValues.js";
import { saveIdahoCosts, writeIdahoWorkbook } from "./idahoReport.js";

/** Real UI enables research and explicitly reuses a completed non-web trial.
 * No credential or graph mutation travels through a fixture-only route. */
export async function driveBrowserIdahoReuse(
  harness: ManualHarness,
  sourceRunId: string,
  output: string,
  headed: boolean,
  signal: AbortSignal,
) {
  const expect = playwrightExpect.configure({ timeout: 30_000 });
  const browser = await chromium.launch({ headless: !headed });
  const page = await browser.newPage({
    acceptDownloads: true,
    viewport: { width: 1560, height: 1100 },
  });
  const stop = () => {
    void browser.close().catch(() => undefined);
  };
  signal.addEventListener("abort", stop, { once: true });
  const state = () => harness.request<YpWorkflowSnapshot>("");
  const save = (name: string, value: unknown) =>
    writeFile(path.join(output, name), JSON.stringify(value, null, 2), {
      mode: 0o600,
    });
  const screenshot = (name: string) =>
    page.screenshot({ path: path.join(output, `${name}.png`), fullPage: true });
  const button = (name: string) =>
    page.getByRole("button", { name, exact: true });
  const before = await state();
  const source = before.runs.find((r) => r.id === sourceRunId)!;
  const checks: string[] = [];
  try {
    await page.goto(harness.baseUrl);
    if (
      !before.codexAuthMode &&
      (await button("Use imported test key").isVisible())
    ) {
      await button("Use imported test key").click();
      await expect(
        page.getByText("OpenAI API key connected", { exact: true }),
      ).toBeVisible();
    }
    await button("Agents").click();
    await page
      .getByRole("combobox", { name: "Display", exact: true })
      .selectOption("draft");
    for (const label of [
      "License and degree research",
      "Education and statute research",
    ]) {
      await page
        .locator("yp-live-workflow-graph")
        .getByRole("button", { name: label, exact: true })
        .click();
      const dialog = page.getByRole("dialog", { name: label, exact: true });
      await dialog.getByText("Agent configuration", { exact: true }).click();
      await dialog
        .getByRole("checkbox", { name: "Enabled", exact: true })
        .check();
      await expect(
        dialog.getByRole("spinbutton", {
          name: "Per-parent record cap (USD, optional)",
          exact: true,
        }),
      ).toHaveValue("0.5");
      await dialog
        .getByRole("button", { name: "Save agent settings", exact: true })
        .click();
      await expect(dialog).toHaveCount(0);
    }
    await button("Data").click();
    await page.getByText(/^Reuse completed (trial )?analysis$/).click();
    await page
      .getByRole("combobox", { name: /^Completed (trial|run)$/ })
      .selectOption(source.id);
    await page
      .getByRole("combobox", { name: "Restart from agent", exact: true })
      .selectOption("licenses");
    await screenshot("09-reuse-selection");
    await button("Run 5-record trial").click();
    const accepted = await waitFor(
      "reused research trial",
      async () =>
        (await state()).runs.find((r) => r.reuse?.runId === source.id),
      60_000,
      signal,
    );
    assert.deepEqual(accepted.reuse!.nodeIds, [
      "adapt-import",
      "normalize",
      "levels",
      "analyze",
    ]);
    assert.deepEqual(accepted.sample, source.sample);
    await button("Agents").click();
    await page
      .getByRole("combobox", { name: "Display", exact: true })
      .selectOption(accepted.id);
    let lastNode = "";
    const run = await waitFor(
      "bounded research with reused analysis",
      async () => {
        const current = (await state()).runs.find((r) => r.id === accepted.id)!;
        if (["failed", "cancelled", "paused"].includes(current.status))
          throw new Error(`${current.status}: ${current.error}`);
        const active = Object.entries(current.nodeStates).find(
          ([, s]) => s.status === "running",
        )?.[0];
        if (active && active !== lastNode) {
          lastNode = active;
          console.info(
            `[idaho-reuse] Running ${active}; new processing $${(current.spentMicros / 1e6).toFixed(4)}`,
          );
          await screenshot(`10-reuse-running-${active}`);
        }
        return current.status === "completed" && current;
      },
      70 * 60_000,
      signal,
    );
    await save("trial-run.json", run);
    await expect(
      page
        .locator("yp-live-workflow-graph")
        .getByRole("region", { name: "Agent activity" }),
    ).toContainText("Run completed.");
    await page
      .locator("yp-live-workflow-graph")
      .getByRole("button", { name: "Show all agents", exact: true })
      .click();
    await page
      .locator("yp-live-workflow-graph")
      .getByRole("button", { name: "Fit", exact: true })
      .click();
    await screenshot("11-reuse-completed");
    const usage = await harness.request<UsageReservation[]>("/usage");
    for (const node of run.reuse!.nodeIds) {
      assert.equal(run.nodeCosts?.[node]?.spentMicros ?? 0, 0);
      assert.equal(
        usage.filter((u) => u.runId === run.id && u.nodeId === node).length,
        0,
      );
      assert.equal(
        run.stageOutputs![node].checksum,
        source.stageOutputs![node].checksum,
      );
      assert.equal(
        run.stageOutputs![node].originRunId,
        source.stageOutputs![node].originRunId,
      );
      assert.match(run.nodeStates[node].message!, /Reused/);
    }
    checks.push(
      "Identical sampled parents and verified upstream snapshots, with zero new upstream requests",
    );
    const settled = usage.filter((u) => u.runId === run.id);
    assert.equal(
      settled.every((u) => u.status === "settled"),
      true,
    );
    assert.equal(run.reservedMicros, 0);
    for (const node of ["licenses", "education"]) {
      const cap = run.graph.nodes.find(
        (n) => n.id === node,
      )!.recordBudgetMicros!;
      for (const parent of run.sample!.recordIds)
        assert.ok(
          settled
            .filter((u) => u.nodeId === node && u.recordId === parent)
            .reduce((sum, u) => sum + u.actualMicros!, 0) <= cap,
        );
    }
    const snapshot = await state();
    const rows: Record<string, unknown>[] = [];
    let csv: Buffer | undefined, xlsx: Buffer | undefined, memory: unknown;
    await button("Data").click();
    for (const asset of snapshot.assets.filter(
      (a) => a.name.startsWith(`${run.id}-`) && !a.stagePart,
    )) {
      const pending = page.waitForEvent("download");
      await page.getByRole("link", { name: asset.name, exact: true }).click();
      const download = await pending;
      assert.equal(await download.failure(), null);
      const file = path.join(output, asset.name);
      await download.saveAs(file);
      const bytes = await readFile(file);
      verifyDownload(asset, bytes);
      if (asset.resultSet) rows.push(...JSON.parse(bytes.toString()));
      if (asset.name.endsWith("-skills-first.csv")) csv = bytes;
      if (asset.name.endsWith("-skills-first.xlsx")) xlsx = bytes;
      if (asset.name.endsWith("-skills-first.json"))
        memory = JSON.parse(bytes.toString());
    }
    assert.ok(csv && xlsx && memory);
    await save("last-run-results.json", rows);
    const research = verifyIdahoResearch(rows, usage, run.id);
    await save("research-verification.json", research);
    const values = await verifySkillsFirstValues({
      runId: run.id,
      analysisRunId: source.stageOutputs!.analyze.originRunId,
      records: rows,
      memory,
      csv,
      xlsx,
      usage,
    });
    await save("value-verification.json", values);
    const costs = await saveIdahoCosts(
      harness,
      output,
      rows.map((r) => String(r.id)),
    );
    await writeIdahoWorkbook(output, rows, costs, xlsx);
    assert.equal(research.passed, true, JSON.stringify(research.issues));
    assert.ok(
      research.quotesVerified > 0,
      "No retrieved web evidence reached output",
    );
    assert.equal(
      values.passed,
      true,
      JSON.stringify(values.missingOrChangedValues),
    );
    assert.equal(rows.length, 5);
    assert.ok(
      rows.every((r) => Array.isArray(r.errors) && !r.errors.length),
      "Record failures remain",
    );
    checks.push(
      "Research evidence and reused analysis preserved through the browser-downloaded 74-column workbook",
    );
    await button("Results").click();
    await expect(page.locator("yp-live-workflow-results article")).toHaveCount(
      5,
    );
    const card = page.locator("yp-live-workflow-results article").first();
    await card.getByText("License and legal research", { exact: true }).click();
    for (const label of [
      "License and degree research",
      "Education and statute research",
    ])
      await card
        .locator("summary")
        .filter({ hasText: `${label} ·` })
        .first()
        .click();
    await card.screenshot({
      path: path.join(output, "12-reuse-research-coverage.png"),
    });
    await button("Usage").click();
    await screenshot("13-reuse-usage");
    await page.reload();
    await button("Agents").click();
    await page
      .getByRole("combobox", { name: "Display", exact: true })
      .selectOption(run.id);
    await button("Data").click();
    await expect(page.getByText(/Historical processing cost/)).toBeVisible();
    const after = await state();
    assert.equal(after.runs.filter((r) => r.mode === "trial").length, 2);
    assert.ok(
      after.runs
        .filter((r) => r.mode === "bulk")
        .every((r) => !r.approvedAt && !r.spentMicros),
    );
    const report = {
      passed: true,
      checks,
      runId: run.id,
      sourceRunId: source.id,
      reuse: run.reuse,
      incrementalProcessingMicros: run.spentMicros,
      research,
      values,
      bulkApproved: false,
    };
    await save("reuse-verification.json", report);
    return report;
  } catch (error) {
    await screenshot("reuse-failure").catch(() => undefined);
    await save("reuse-verification.json", {
      passed: false,
      checks,
      error: String(error),
    });
    throw error;
  } finally {
    signal.removeEventListener("abort", stop);
    await browser.close();
  }
}
