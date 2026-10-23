import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, expect } from "@playwright/test";
import { parse } from "csv-parse/sync";
import { fixturePath } from "./environment.js";
import { waitFor } from "./harness.js";
import { verifyDownload, verifySkillsFirstOutput, } from "./verification.js";
export async function runManualScenario(harness, outputDir, headed, chatgpt, signal) {
    signal?.throwIfAborted();
    const browser = await chromium.launch({ headless: !headed });
    const context = await browser.newContext({
        acceptDownloads: true,
        viewport: { width: 1440, height: 1000 },
    });
    const page = await context.newPage();
    const abort = () => {
        void context.close().catch(() => undefined);
    };
    signal?.addEventListener("abort", abort, { once: true });
    page.setDefaultTimeout(60000);
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    const apiErrors = [];
    page.on("response", async (response) => {
        if (response.url().startsWith(`${harness.baseUrl}/api/live-workflows/`) &&
            response.status() >= 400) {
            const body = (await response.json().catch(() => ({})));
            apiErrors.push(`${new URL(response.url()).pathname} (${response.status()}): ${body.error ?? "request failed"}`);
        }
    });
    const step = (name) => console.info(`[manual] ${name}`);
    try {
        signal?.throwIfAborted();
        await page.route("**/*", (route) => new URL(route.request().url()).origin === harness.baseUrl
            ? route.continue()
            : route.abort());
        await page.goto(harness.baseUrl);
        if (chatgpt) {
            step(`Open ${harness.baseUrl} in your browser, choose Connect ChatGPT and complete sign-in (10 minute limit).`);
            await waitFor("ChatGPT sign-in", async () => (await harness.request("")).chatgptConnected, 600000, signal);
            await page.reload();
        }
        const { assistantName = "Workflow Assistant" } = await harness.request("");
        step("1/4: Say hello to Codex");
        await page
            .getByRole("textbox", { name: `Message ${assistantName}`, exact: true })
            .fill("Hello! Briefly say hello and that you are ready for Skills First job descriptions. Do not use tools, inspect files, change code, or start a run.");
        await page.getByRole("button", { name: "Send", exact: true }).click();
        await waitFor("Codex greeting", async () => {
            if (apiErrors.length)
                throw new Error(apiErrors.join("; "));
            const { events } = await harness.request("/events");
            const failure = events.find((event) => event.type === "session.event" &&
                ["session.error", "approval.requested"].includes(String(event.data.eventType)));
            if (failure)
                throw new Error(`Codex greeting needs attention: ${failure.data.eventType}`);
            return events.find((event) => event.type === "session.event" &&
                event.data.eventType === "turn.completed");
        }, 300000, signal);
        const { events: greetingEvents } = await harness.request("/events");
        const messages = greetingEvents.filter((event) => event.type === "session.event" &&
            event.data.eventType === "message.completed");
        assert.ok(messages.length, "Codex did not return an assistant message");
        // Verify the message also arrived in the UI through SSE, not only in the event log.
        const greeting = messages
            .map((event) => event.data.payload?.text ?? "")
            .join("\n");
        assert.ok(greeting.trim(), "Codex greeting was empty");
        await expect(page.getByText(greeting, { exact: true })).toBeVisible({
            timeout: 30000,
        });
        await writeFile(path.join(outputDir, "greeting.txt"), greeting, {
            mode: 0o600,
        });
        step("2/4: Upload the two fictional job descriptions");
        const raw = await readFile(fixturePath);
        const jobs = JSON.parse(raw.toString());
        await page.getByRole("button", { name: "Data", exact: true }).click();
        await page.locator("input[type=file]").setInputFiles(fixturePath);
        await expect(page.getByRole("link", {
            name: "skills-first-jobs.json",
            exact: true,
        })).toBeVisible({ timeout: 30000 });
        const inputSnapshot = await harness.request("");
        const uploaded = inputSnapshot.assets.find((asset) => asset.source === "upload" && asset.name === "skills-first-jobs.json");
        assert.ok(uploaded, "The uploaded file was not persisted");
        // Input IDs are namespaced by the immutable asset version to avoid collisions across uploads.
        const importedJobs = jobs.map((job) => ({
            ...job,
            id: `${uploaded.id}:${job.id}`,
        }));
        const original = await fetch(`${harness.baseUrl}/api/live-workflows/groups/1/assets/${uploaded.id}`);
        assert.equal(original.status, 200);
        verifyDownload(uploaded, Buffer.from(await original.arrayBuffer()));
        const forbidden = await fetch(`${harness.baseUrl}/api/live-workflows/groups/2/assets/${uploaded.id}`);
        assert.equal(forbidden.status, 403, "Another group can read the private upload");
        const preview = await harness.request(`/assets/${uploaded.id}/preview`);
        assert.equal(preview.inputCount, jobs.length);
        assert.deepEqual(new Set(preview.preview.map((row) => row.id)), new Set(importedJobs.map((row) => row.id)));
        step("3/4: Run the Skills First trial with the configured allowance");
        await page
            .getByLabel("Trial records", { exact: true })
            .fill(String(jobs.length));
        await page.getByLabel("Trial records", { exact: true }).press("Tab");
        await page
            .getByRole("button", {
            name: `Run ${jobs.length}-record trial`,
            exact: true,
        })
            .click();
        let status = "";
        const completed = await waitFor("Skills First trial", async () => {
            if (apiErrors.length)
                throw new Error(apiErrors.join("; "));
            const snapshot = await harness.request("");
            const run = snapshot.runs[0];
            if (!run)
                return false;
            const description = `${run.status} (${Object.entries(run.nodeStates)
                .filter(([, state]) => state.status === "completed")
                .map(([id]) => id)
                .join(", ") || "starting"})`;
            if (description !== status) {
                step(description);
                status = description;
            }
            if (["failed", "paused", "cancelled"].includes(run.status))
                throw new Error(`Trial ${run.status}; inspect report diagnostics. No retry or budget increase is automatic.`);
            return run.status === "completed" ? { snapshot, run } : false;
        }, 2700000, signal);
        const { snapshot, run } = completed;
        await expect(page.getByText("trial · completed", { exact: true })).toBeVisible({ timeout: 30000 });
        assert.equal(run.inputCount, jobs.length);
        assert.equal(run.mode, "trial");
        assert.ok(run.spentMicros > 0, "The gateway did not account for model usage");
        assert.ok(run.spentMicros <= run.budgetMicros, "The trial exceeded its allowance");
        assert.equal(run.reservedMicros, 0, "Unsettled cost reservations remain");
        for (const id of ["normalize", "levels", "analyze", "rewrite", "export"])
            assert.equal(run.nodeStates[id]?.status, "completed", `Stage ${id} did not complete`);
        const usage = await harness.request("/usage");
        assert.ok(usage.length > 0);
        assert.ok(usage.every((item) => item.status === "settled"), "Unsettled provider outcomes need manual reconciliation");
        assert.equal(usage.reduce((sum, item) => sum + (item.actualMicros ?? 0), 0), run.spentMicros);
        step("4/4: Download and validate memory JSON, CSV, Excel and Markdown results");
        const downloaded = [];
        let output;
        for (const extension of ["json", "csv", "xlsx", "md"]) {
            const name = `${run.id}-skills-first.${extension}`;
            const asset = snapshot.assets.find((asset) => asset.name === name && asset.source === "artifact");
            assert.ok(asset, `Missing ${extension} export`);
            const link = page.getByRole("link", { name, exact: true });
            await expect(link).toBeVisible({ timeout: 30000 });
            const pending = page.waitForEvent("download");
            await link.click();
            const download = await pending;
            assert.equal(download.suggestedFilename(), name);
            const file = path.join(outputDir, `skills-first.${extension}`);
            await download.saveAs(file);
            assert.equal(await download.failure(), null);
            const bytes = await readFile(file);
            verifyDownload(asset, bytes);
            if (extension === "json") {
                output = JSON.parse(bytes.toString());
                // Report agent/record errors before a less useful CSV rewrite assertion.
                verifySkillsFirstOutput(importedJobs, output);
            }
            if (extension === "csv") {
                const rows = parse(bytes, { columns: true, from_line: 2 });
                assert.equal(rows.length, jobs.length);
                for (const job of importedJobs) {
                    const row = rows.find((row) => row.name === job.name);
                    assert.ok(row);
                    assert.equal(Object.keys(row).length, 74);
                }
            }
            if (extension === "md")
                for (const job of jobs)
                    assert.ok(bytes.toString().includes(job.name));
            downloaded.push({
                name: path.basename(file),
                bytes: asset.bytes,
                checksum: asset.checksum,
            });
        }
        const quality = verifySkillsFirstOutput(importedJobs, output);
        const reviewed = await harness.request(`/runs/${run.id}/results`);
        assert.equal(reviewed.total, jobs.length);
        await page.getByRole("button", { name: "Results", exact: true }).click();
        await expect(page.getByText(`${jobs.length} matching results`, { exact: true })).toBeVisible({ timeout: 30000 });
        await page.screenshot({
            path: path.join(outputDir, "results.png"),
            fullPage: true,
        });
        assert.deepEqual(pageErrors, [], "The browser reported JavaScript errors");
        return {
            runId: run.id,
            sourceHash: run.sourceHash,
            runtimeImage: run.runtimeImage,
            quality,
            downloads: downloaded,
            processingSpentMicros: run.spentMicros,
            processingCapMicros: run.budgetMicros,
            agents: run.nodeCosts,
            requests: usage.length,
            codexBilling: "Separate ChatGPT quota or API charge; not included in the processing allowance.",
        };
    }
    finally {
        signal?.removeEventListener("abort", abort);
        await context.close();
        await browser.close();
    }
}
