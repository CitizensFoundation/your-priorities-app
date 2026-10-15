import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { expect as playwrightExpect } from "@playwright/test";
import type { UsageReservation } from "../../budget.js";
import { fixturePath } from "../manual/environment.js";
import { waitFor, type ManualHarness } from "../manual/harness.js";
import type { GroupCreationContinuation } from "../manual/groupCreationDriver.js";
import {
  verifyDownload,
  verifySkillsFirstOutput,
  type ManualJob,
} from "../manual/verification.js";
import { verifySkillsFirstValues } from "../manual/skillsFirstValues.js";

const expect = playwrightExpect.configure({ timeout: 30_000 });

export function lifecycleScenario(
  harness: ManualHarness,
  output: string,
  signal: AbortSignal,
): GroupCreationContinuation {
  return {
    budgetMicros: 2_000_000, // Simulated ledger money; all providers are local fixtures.
    async run({ page, groupId, check, screenshot }) {
      const workflow = page.locator("yp-live-workflow");
      const button = (name: string) =>
        workflow.getByRole("button", { name, exact: true });
      const state = () => harness.request<YpWorkflowSnapshot>("");
      const bytes = await readFile(fixturePath);
      const original = JSON.parse(bytes.toString()) as ManualJob[];
      const download = async (
        asset: YpWorkflowAsset,
        filename = asset.name,
      ) => {
        await button("Data").click();
        const pending = page.waitForEvent("download");
        await workflow.locator(`a[href$="/assets/${asset.id}"]`).click();
        const received = await pending;
        assert.equal(received.suggestedFilename(), asset.name);
        const file = path.join(output, filename);
        await received.saveAs(file);
        assert.equal(await received.failure(), null);
        const data = await readFile(file);
        verifyDownload(asset, data);
        return data;
      };
      await button("Data").click();
      await workflow.locator("input[type=file]").setInputFiles(fixturePath);
      await expect(
        workflow.getByRole("link", {
          name: "skills-first-jobs.json",
          exact: true,
        }),
      ).toBeVisible();
      const uploaded = (await state()).assets.find(
        (a) => a.source === "upload",
      )!;
      assert.ok(uploaded);
      assert.deepEqual(await download(uploaded), bytes);
      const row = workflow
        .locator("tr")
        .filter({ has: page.locator(`a[href$="/assets/${uploaded.id}"]`) });
      await row.getByRole("button", { name: "Preview", exact: true }).click();
      await expect(workflow.locator(".inspector")).toContainText("2 records");
      await screenshot("07-upload-and-preview.png");
      await check(
        "New group's uploaded jobs preview correctly and download byte-for-byte",
      );

      await workflow.getByLabel("Trial records", { exact: true }).fill("2");
      await workflow.getByLabel("Trial records", { exact: true }).press("Tab");
      await button("Run 2-record trial").click();
      const finished = await waitFor(
        "complete two-job workflow",
        async () => {
          const snapshot = await state();
          const run = snapshot.runs[0];
          if (!run) return false;
          if (["failed", "paused", "cancelled"].includes(run.status))
            throw new Error(
              `Trial ${run.status}: ${run.error ?? "see saved evidence"}`,
            );
          return run.status === "completed" && !snapshot.workspace.activeRunId
            ? { snapshot, run }
            : false;
        },
        180_000,
        signal,
      );
      const { snapshot, run } = finished;
      assert.equal(snapshot.runs.length, 1);
      assert.equal(run.mode, "trial");
      assert.equal(run.inputCount, original.length);
      assert.deepEqual(run.assetIds, [uploaded.id]);
      assert.deepEqual(
        new Set(run.nodeIds),
        new Set(["normalize", "levels", "analyze", "rewrite", "export"]),
      );
      for (const id of run.nodeIds)
        assert.equal(run.nodeStates[id].status, "completed", id);
      await button("Agents").click();
      await expect(
        workflow.getByText("trial · completed", { exact: true }),
      ).toBeVisible();
      await screenshot("08-completed-agents.png");

      const usage = await harness.request<UsageReservation[]>("/usage");
      assert.equal(
        usage.length,
        20,
        "Two jobs each require level detection, seven analyses, rewrite and review",
      );
      assert.equal(harness.processingCalls.length, usage.length);
      assert.equal(
        new Set(harness.processingCalls.map((c) => c.id)).size,
        usage.length,
      );
      assert.ok(
        harness.processingCalls.every(
          (c) => c.status === 200 && c.runId === run.id,
        ),
      );
      assert.ok(usage.every((u) => u.status === "settled"));
      const byAgent = Object.fromEntries(
        run.nodeIds.map((id) => [
          id,
          usage
            .filter((u) => u.nodeId === id)
            .reduce((sum, u) => sum + u.actualMicros!, 0),
        ]),
      );
      for (const [id, amount] of Object.entries(byAgent))
        assert.equal(
          run.nodeCosts?.[id]?.spentMicros ?? 0,
          amount,
          `Cost mismatch for ${id}`,
        );
      const total = Object.values(byAgent).reduce(
        (sum, value) => sum + value,
        0,
      );
      assert.ok(total > 0 && total <= run.budgetMicros);
      assert.equal(run.spentMicros, total);
      assert.equal(snapshot.workspace.spentMicros, total);
      assert.equal(snapshot.workspace.trialSpentMicros, total);
      assert.equal(snapshot.workspace.reservedMicros, 0);
      assert.equal(snapshot.workspace.trialReservedMicros, 0);
      assert.equal(run.reservedMicros, 0);
      await check(
        "Exactly one full trial completed; every agent's simulated cost reconciles with the ledger",
      );

      const downloads: Record<string, Buffer> = {};
      for (const extension of ["json", "csv", "xlsx", "md"]) {
        const asset = snapshot.assets.find(
          (a) => a.name === `${run.id}-skills-first.${extension}`,
        );
        assert.ok(asset, `Missing ${extension} export`);
        downloads[extension] = await download(
          asset,
          `skills-first.${extension}`,
        );
      }
      const memory: unknown = JSON.parse(downloads.json.toString());
      const quality = verifySkillsFirstOutput(
        original.map((job) => ({ ...job, id: `${uploaded.id}:${job.id}` })),
        memory,
      );
      const resultAssets = snapshot.assets.filter(
        (a) => a.resultSet?.runId === run.id,
      );
      assert.ok(resultAssets.length);
      const records: Record<string, unknown>[] = [];
      for (const asset of resultAssets) {
        const rows: unknown = JSON.parse((await download(asset)).toString());
        assert.ok(Array.isArray(rows));
        records.push(...rows);
      }
      const verification = await verifySkillsFirstValues({
        runId: run.id,
        records,
        memory,
        csv: downloads.csv,
        xlsx: downloads.xlsx,
        usage,
      });
      await writeFile(
        path.join(output, "value-verification.json"),
        JSON.stringify(verification, null, 2),
      );
      assert.deepEqual(verification.missingOrChangedValues, []);
      assert.equal(verification.masterColumns, 74);
      assert.equal(verification.rawResponses, original.length * 7);
      for (const job of original)
        assert.ok(downloads.md.toString().includes(job.name));
      await check(
        "Browser-downloaded JSON, CSV, Excel and Markdown preserve source records and all returned analysis values",
      );

      await button("Results").click();
      await expect(
        workflow.getByText("2 matching results", { exact: true }),
      ).toBeVisible();
      for (const job of original)
        await expect(
          workflow.locator("yp-live-workflow-results"),
        ).toContainText(job.name);
      await screenshot("09-results.png");
      await button("Usage").click();
      for (const entry of usage)
        await expect(
          workflow.getByText(entry.id, { exact: true }),
        ).toBeVisible();
      await screenshot("10-usage.png");
      const callsBeforeReload = harness.processingCalls.length;
      await page.reload();
      await button("Results").click();
      await expect(
        workflow.getByText("2 matching results", { exact: true }),
      ).toBeVisible();
      const reloaded = await state();
      assert.equal(reloaded.workspace.groupId, groupId);
      assert.equal(reloaded.workspace.id, snapshot.workspace.id);
      assert.equal(reloaded.runs.length, 1);
      assert.deepEqual(reloaded.runs[0], run);
      assert.equal(reloaded.workspace.spentMicros, total);
      assert.equal(harness.processingCalls.length, callsBeforeReload);
      assert.equal(harness.codexUsage.report().turns, 1);
      const workbook = snapshot.assets.find(
        (a) => a.name === `${run.id}-skills-first.xlsx`,
      )!;
      assert.deepEqual(
        await download(workbook, "skills-first-after-reload.xlsx"),
        downloads.xlsx,
      );
      await screenshot("11-reloaded-downloads.png");
      await writeFile(
        path.join(output, "costs.json"),
        JSON.stringify(
          {
            simulated: true,
            realProviderCalls: 0,
            totalMicros: total,
            byAgent,
            usage,
          },
          null,
          2,
        ),
      );
      await check(
        "Reload preserves results, source/model snapshots, workbook bytes and cost without repeating work",
      );
      return {
        runId: run.id,
        sourceHash: run.sourceHash,
        quality,
        simulated: true,
        realProviderCalls: 0,
        costsByAgentMicros: byAgent,
        valueChecks: verification.checks,
      };
    },
  };
}
