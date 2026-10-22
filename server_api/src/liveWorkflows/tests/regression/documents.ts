import assert from "node:assert/strict";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { request as httpRequest } from "node:http";
import path from "node:path";
import { expect as playwrightExpect } from "@playwright/test";
import { maximumUploadBytes } from "../../assets.js";
import { waitFor, type ManualHarness } from "../manual/harness.js";
import type { GroupCreationContinuation } from "../manual/groupCreationDriver.js";
import { verifyDownload } from "../manual/verification.js";
import {
  documentFixtures,
  malformedDocuments,
  type DocumentFixture,
} from "./documentFixtures.js";

const expect = playwrightExpect.configure({ timeout: 30_000 });

export function documentsScenario(
  harness: ManualHarness,
  output: string,
  signal: AbortSignal,
): GroupCreationContinuation {
  return {
    budgetMicros: 0,
    async run({ page, groupId, check, screenshot, expectFailure }) {
      const workflow = page.locator("yp-live-workflow");
      const button = (name: string) =>
        workflow.getByRole("button", { name, exact: true });
      const state = () => harness.request<YpWorkflowSnapshot>("");
      const base = `/api/live-workflows/groups/${groupId}`;
      const row = (asset: YpWorkflowAsset) =>
        workflow
          .locator("tr")
          .filter({ has: page.locator(`a[href$="/assets/${asset.id}"]`) });
      const upload = async (fixture: DocumentFixture, status = 200) => {
        await button("Data").click();
        if (status >= 400) expectFailure("POST", `${base}/assets`, status);
        const response = page.waitForResponse(
          (r) =>
            new URL(r.url()).pathname === `${base}/assets` &&
            r.request().method() === "POST",
        );
        await workflow.locator("input[type=file]").setInputFiles({
          name: fixture.name,
          mimeType: "application/octet-stream",
          buffer: fixture.buffer,
        });
        const result = await response;
        assert.equal(result.status(), status);
        if (status !== 200) {
          const body = (await result.json()) as { error: string };
          await expect(workflow.locator('[role="alert"]')).toContainText(
            body.error,
          );
          return undefined;
        }
        const asset = (await result.json()) as YpWorkflowAsset;
        await expect(row(asset)).toBeVisible();
        await expect(workflow.locator('[role="alert"]')).toHaveCount(0);
        await expect(workflow.locator("input[type=file]")).toHaveValue("");
        return asset;
      };
      const download = async (asset: YpWorkflowAsset) => {
        const pending = page.waitForEvent("download");
        await row(asset).getByRole("link").click();
        const received = await pending;
        const file = path.join(output, `${asset.version}-${asset.name}`);
        await received.saveAs(file);
        assert.equal(await received.failure(), null);
        const bytes = await readFile(file);
        verifyDownload(asset, bytes);
        return bytes;
      };
      const preview = async (asset: YpWorkflowAsset, status = 200) => {
        const route = `${base}/assets/${asset.id}/preview`;
        if (status >= 400) expectFailure("GET", route, status);
        const response = page.waitForResponse(
          (r) => new URL(r.url()).pathname === route,
        );
        await row(asset)
          .getByRole("button", { name: "Preview", exact: true })
          .click();
        const result = await response;
        assert.equal(result.status(), status);
        return result.json() as Promise<{
          inputCount: number;
          preview: Record<string, unknown>[];
          error?: string;
        }>;
      };
      const remove = async (asset: YpWorkflowAsset) => {
        const response = page.waitForResponse(
          (r) =>
            new URL(r.url()).pathname === `${base}/assets/${asset.id}` &&
            r.request().method() === "DELETE",
        );
        await row(asset)
          .getByRole("button", { name: "Delete", exact: true })
          .click();
        assert.equal((await response).status(), 200);
        await expect(row(asset)).toHaveCount(0);
      };
      const untouched = async () => {
        const snapshot = await state();
        assert.equal(snapshot.runs.length, 0);
        assert.equal(snapshot.workspace.spentMicros, 0);
        assert.equal(snapshot.workspace.reservedMicros, 0);
        assert.equal(snapshot.workspace.uploadReservedBytes, 0);
        assert.equal(
          snapshot.workspace.storedBytes,
          snapshot.assets.reduce((sum, asset) => sum + asset.bytes, 0),
        );
        assert.equal(harness.processingCalls.length, 0);
        assert.deepEqual(await harness.request("/usage"), []);
        return snapshot;
      };

      const fixtures = await documentFixtures();
      const saved: YpWorkflowAsset[] = [];
      for (const fixture of fixtures) {
        const asset = (await upload(fixture))!;
        saved.push(asset);
        assert.deepEqual(await download(asset), fixture.buffer);
        const parsed = await preview(asset);
        assert.equal(parsed.inputCount, fixture.expectedRows?.length ?? 1);
        assert.equal(
          new Set(parsed.preview.map((r) => r.id)).size,
          parsed.inputCount,
        );
        if (fixture.expectedRows) {
          for (const [index, original] of fixture.expectedRows.entries())
            assert.deepEqual(parsed.preview[index], {
              ...original,
              id: `${asset.id}:${original.id}`,
              source: asset.id,
            });
        } else {
          const text = String(parsed.preview[0].text);
          for (const expected of fixture.expectedText!)
            assert.ok(
              text.includes(expected),
              `${fixture.name}: lost ${expected}`,
            );
          assert.ok(
            !text.includes("must-not-run") && !text.includes("display:none"),
          );
        }
        await expect(workflow.locator(".inspector")).toContainText(
          `${parsed.inputCount} records`,
        );
        await untouched();
      }
      await screenshot("07-document-previews.png");
      await check(
        "Real PDF, DOCX, quoted Unicode CSV, TSV, text and HTML parse inside containers and download unchanged",
      );

      const original = saved.find((a) => a.name === "quoted-jobs.csv")!;
      const replacement: DocumentFixture = {
        name: original.name,
        buffer: Buffer.from(
          "id,name,text,titleCode\n00099,Replacement,Changed description.,00007",
        ),
      };
      const updated = (await upload(replacement))!;
      assert.equal(updated.version, original.version + 1);
      assert.notEqual(updated.id, original.id);
      assert.notEqual(updated.checksum, original.checksum);
      assert.deepEqual(
        await download(original),
        fixtures.find((f) => f.name === original.name)!.buffer,
      );
      assert.deepEqual(await download(updated), replacement.buffer);
      assert.equal(
        (await preview(updated)).preview[0].id,
        `${updated.id}:00099`,
      );
      await remove(original);
      const removed = await fetch(
        `${harness.baseUrl}${base}/assets/${original.id}`,
      );
      assert.equal(removed.status, 404);
      await assert.rejects(
        readFile(
          path.join(
            harness.service.root((await state()).workspace),
            "workspace/data",
            original.id,
          ),
        ),
        { code: "ENOENT" },
      );
      assert.deepEqual(await download(updated), replacement.buffer);
      await page.reload();
      await button("Data").click();
      await expect(row(updated)).toBeVisible();
      await expect(row(original)).toHaveCount(0);
      await check(
        "Replacement uploads preserve old versions; deletion removes only that version and its VM cache across reload",
      );

      for (const fixture of malformedDocuments) {
        await preview(updated);
        await expect(workflow.locator(".inspector")).toContainText(
          "Replacement",
        );
        const asset = (await upload(fixture))!;
        const result = await preview(asset, 502);
        assert.ok(
          result.error?.includes(`Cannot read ${fixture.name}`),
          result.error ?? "Missing input error",
        );
        assert.ok(
          !/\/opt\/|node_modules|Error:|at parse/.test(result.error!),
          "Parser internals must not be sent to the browser",
        );
        await expect(workflow.locator('[role="alert"]')).toContainText(
          `Cannot read ${fixture.name}`,
        );
        await expect(workflow.locator(".inspector")).toHaveCount(0);
        const boxes = workflow.getByRole("checkbox", { name: /^Select / });
        for (const box of await boxes.all()) await box.uncheck();
        await row(asset).getByRole("checkbox").check();
        await workflow.getByLabel("Trial records", { exact: true }).fill("1");
        await workflow
          .getByLabel("Trial records", { exact: true })
          .press("Tab");
        expectFailure("POST", `${base}/runs`, 502);
        const failedRun = page.waitForResponse(
          (r) =>
            new URL(r.url()).pathname === `${base}/runs` &&
            r.request().method() === "POST",
        );
        await button("Run 1-record trial").click();
        assert.equal((await failedRun).status(), 502);
        await expect(workflow.locator('[role="alert"]')).toContainText(
          `Cannot read ${fixture.name}`,
        );
        await untouched();
        assert.deepEqual(await download(asset), fixture.buffer);
        await screenshot(`08-${fixture.name}-error.png`);
        await remove(asset);
        await check(
          `${fixture.name} is rejected by preview and trial preparation before creating a run or charging a model`,
        );
      }
      await upload({ name: "empty.txt", buffer: Buffer.alloc(0) }, 400);
      await expect(workflow.locator('[role="alert"]')).toContainText(
        "Empty files cannot be uploaded",
      );
      await untouched();
      await check(
        "Empty uploads return a useful error without consuming storage or model budget",
      );

      // A genuine partial socket write exercises server cleanup; no response is mocked.
      const before = await untouched();
      const reserved = 1024 * 1024;
      const partial = httpRequest(`${harness.baseUrl}${base}/assets`, {
        method: "POST",
        headers: {
          origin: harness.baseUrl,
          "content-length": reserved,
          "content-type": "application/octet-stream",
          "x-file-name": "interrupted.csv",
        },
      });
      partial.on("error", () => {}); // ECONNRESET is the deliberate disconnect.
      try {
        partial.write(Buffer.from("id,name,text\n"));
        await waitFor(
          "partial upload reservation",
          async () =>
            (await state()).workspace.uploadReservedBytes === reserved,
          10_000,
          signal,
        );
      } finally {
        partial.destroy();
      }
      await waitFor(
        "interrupted upload cleanup",
        async () => (await state()).workspace.uploadReservedBytes === 0,
        10_000,
        signal,
      );
      const after = await untouched();
      assert.deepEqual(after.assets, before.assets);
      assert.equal(after.workspace.storedBytes, before.workspace.storedBytes);
      assert.ok(
        !(await readdir(path.join(harness.assets.root, String(groupId)))).some(
          (name) => name.endsWith(".upload"),
        ),
      );
      await check(
        "A real mid-upload disconnect releases its reservation and removes the partial file",
      );

      // Reject oversize headers before reading a body; allocate no large test file.
      const oversized = await new Promise<{ status: number; body: string }>(
        (resolve, reject) => {
          const request = httpRequest(
            `${harness.baseUrl}${base}/assets`,
            {
              method: "POST",
              signal,
              headers: {
                origin: harness.baseUrl,
                "content-length": maximumUploadBytes + 1,
                "x-file-name": "oversized.csv",
              },
            },
            (response) => {
              let body = "";
              response.setEncoding("utf8");
              response.on("data", (chunk: string) => {
                body += chunk;
              });
              response.on("error", reject);
              response.on("end", () => {
                resolve({ status: response.statusCode!, body });
                request.destroy();
              });
            },
          );
          request.on("error", reject);
          request.setTimeout(10_000, () =>
            request.destroy(
              new Error("Oversized upload was not rejected promptly"),
            ),
          );
          request.flushHeaders();
        },
      );
      assert.equal(oversized.status, 400);
      assert.match(JSON.parse(oversized.body).error, /250 MiB/);
      await untouched();
      await check(
        "The API rejects oversized declared uploads before allocating storage or reading a body",
      );

      // The UI configures whole GiB. Use the production configuration API to test
      // the byte boundary with tiny files instead of allocating a GiB of test data.
      const resident = (await upload({
        name: "quota-resident.txt",
        buffer: Buffer.alloc(2048, "x"),
      }))!;
      const current = await untouched();
      const quotaBytes = current.workspace.storedBytes + 128;
      await harness.request("/configuration", "PUT", {
        ...current.workspace.config,
        quotaBytes,
      });
      const overflow = {
        name: "quota-overflow.txt",
        buffer: Buffer.alloc(256, "a"),
      };
      await upload(overflow, 409);
      await expect(workflow.locator('[role="alert"]')).toContainText(
        "Workspace storage quota would be exceeded",
      );
      const rejected = await untouched();
      assert.equal(
        rejected.workspace.storedBytes,
        current.workspace.storedBytes,
      );
      assert.equal(rejected.assets.length, current.assets.length);
      await expect(workflow.locator("progress")).toHaveCount(0);
      await screenshot("09-storage-quota-error.png");
      await remove(resident);
      const accepted = (await upload(overflow))!;
      assert.deepEqual(await download(accepted), overflow.buffer);
      await expect(workflow.locator('[role="alert"]')).toHaveCount(0);
      assert.ok((await untouched()).workspace.storedBytes <= quotaBytes);
      await screenshot("10-upload-recovery.png");
      await check(
        "Quota rejection leaves no reservation; deleting data allows the same upload to succeed",
      );
      await writeFile(
        path.join(output, "document-results.json"),
        JSON.stringify(
          {
            validFormats: fixtures.map((f) => f.name),
            rejectedFormats: malformedDocuments.map((f) => f.name),
            interruptedUploadCleaned: true,
            quotaRecovered: true,
            processingCalls: 0,
          },
          null,
          2,
        ),
      );
      return {
        validFormats: fixtures.length,
        rejectedFormats: malformedDocuments.length,
        realProviderCalls: 0,
        processingCalls: 0,
      };
    },
  };
}
