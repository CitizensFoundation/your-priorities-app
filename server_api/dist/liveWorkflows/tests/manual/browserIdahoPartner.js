/** On-command real browser trial. Mutations use visible UI controls; API reads only verify state. */
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, expect as playwrightExpect } from "@playwright/test";
import { parse } from "csv-parse/sync";
import { redactManualText } from "./environment.js";
import { waitFor } from "./harness.js";
import { partnerRecords, partnerExperiment, verifyPartnerSelection, verifyPartnerBrowserActions, } from "./idahoPartner.js";
import { idahoResearchStages } from "./interactiveBrowserIdaho.js";
import { verifyDownload } from "./verification.js";
import { saveIdahoCosts, idahoQuality } from "./idahoReport.js";
import { collectPartnerExports } from "./idahoPartnerExports.js";
import { idahoResearchLimits, idahoResearchNodes, verifyIdahoResearch, } from "./idahoResearch.js";
const expect = playwrightExpect.configure({ timeout: 30000 });
export async function driveBrowserIdahoPartner(harness, config, data, evidence, output, headed, signal) {
    const research = true;
    const experiment = partnerExperiment;
    const stages = idahoResearchStages;
    const browser = await chromium.launch({ headless: !headed });
    const context = await browser.newContext({
        acceptDownloads: true,
        viewport: { width: 1560, height: 1100 },
    });
    const page = await context.newPage();
    page.setDefaultTimeout(30000);
    const abort = () => {
        void context.close().catch(() => undefined);
    };
    signal.addEventListener("abort", abort, { once: true });
    const state = () => harness.request("");
    const button = (name) => page.getByRole("button", { name, exact: true });
    const screenshot = (name) => page.screenshot({ path: path.join(output, `${name}.png`), fullPage: true });
    const errors = [], screenshots = new Set();
    const checks = [];
    const missingResearchCalls = [];
    const check = (label) => {
        checks.push(label);
        console.info(`[idaho-partner] PASS: ${label}`);
    };
    page.on("pageerror", (error) => errors.push(redactManualText(error.message)));
    page.on("response", (response) => {
        if (response.url().startsWith(`${harness.baseUrl}/api/`) &&
            response.status() >= 400)
            errors.push(`${new URL(response.url()).pathname}: ${response.status()}`);
    });
    const downloads = [];
    const download = async (asset) => {
        const pending = page.waitForEvent("download");
        await page.getByRole("link", { name: asset.name, exact: true }).click();
        const file = await pending;
        assert.equal(await file.failure(), null);
        const filename = path.join(output, "browser-downloads", path.basename(asset.name));
        await file.saveAs(filename);
        const bytes = await readFile(filename);
        verifyDownload(asset, bytes);
        downloads.push({
            id: asset.id,
            name: asset.name,
            path: filename,
            checksum: asset.checksum,
        });
        return bytes;
    };
    let lastProgress = 0;
    const progress = async (run) => {
        const active = Object.entries(run.nodeStates).find(([, value]) => value.status === "running")?.[0];
        if (active && !screenshots.has(active)) {
            const label = run.graph.nodes.find((node) => node.id === active).label;
            const activity = page
                .locator("yp-live-workflow-graph")
                .getByRole("region", { name: "Agent activity" });
            // API polling can observe a transition before the UI event arrives. Capture the displayed stage.
            if (await activity.getByText(label, { exact: true }).first().isVisible()) {
                await screenshot(`02-running-${active}`);
                screenshots.add(active);
            }
        }
        if (Date.now() - lastProgress > 30000) {
            console.info(`[idaho-partner] ${run.status} · ${active ?? "waiting"} · $${(run.spentMicros / 1e6).toFixed(4)} settled · $${(run.reservedMicros / 1e6).toFixed(4)} reserved`);
            lastProgress = Date.now();
        }
        if (["failed", "paused", "cancelled"].includes(run.status))
            throw new Error(`Idaho trial ${run.status}: ${run.error ?? "see diagnostics"}`);
    };
    try {
        await mkdir(path.join(output, "browser-downloads"), { recursive: true });
        await page.goto(harness.baseUrl);
        // Deliberately upload before authentication or chat: first user mutation in this case.
        await button("Data").click();
        await page
            .getByLabel("Upload documents or tables (250 MiB per file)", {
            exact: true,
        })
            .setInputFiles(data.fixture);
        await expect(page.getByRole("link", {
            name: path.basename(data.fixture),
            exact: true,
        })).toBeVisible();
        const upload = (await state()).assets.find((asset) => asset.source === "upload");
        assert.ok(upload);
        assert.deepEqual(await download(upload), await readFile(data.fixture));
        await page
            .getByRole("row")
            .filter({
            has: page.getByRole("link", { name: upload.name, exact: true }),
        })
            .getByRole("button", { name: "Preview", exact: true })
            .click();
        await expect(page.getByText("10 records · preview shows up to 20 records with shortened long fields.", { exact: true })).toBeVisible();
        await screenshot("01-upload-first-10");
        check("First UI step uploads exactly ten Idaho records, previews them and downloads identical bytes");
        if (research) {
            await expect(page.getByText("Idaho web research", { exact: true })).toBeVisible();
            await button("Usage").click();
            await button("Refresh account credits").click();
            await expect(page.getByRole("region", { name: "Firecrawl usage" })).toContainText("account credits remaining");
            await screenshot("01-firecrawl-connected");
            check("Server-imported Firecrawl connection and account credits are visible without sending its key through the browser");
        }
        await button("Use imported test key").click();
        await expect(page.getByText("OpenAI API key connected", { exact: true })).toBeVisible();
        await button("Agents").click();
        let cursor = (await state()).workspace.nextEvent;
        let finished = false, items = 0;
        const replies = [];
        await page
            .getByRole("textbox", {
            name: "Message Skills First Assistant",
            exact: true,
        })
            .fill(experiment);
        await button("Send").click();
        await screenshot("02-chat-request");
        await waitFor("Idaho Codex adaptation and trial request", async () => {
            assert.deepEqual(errors, []);
            const { events } = await harness.request(`/events?after=${cursor}`);
            cursor = events.at(-1)?.seq ?? cursor;
            for (const event of events) {
                if (event.type !== "session.event")
                    continue;
                if (["session.error", "approval.requested"].includes(String(event.data.eventType)))
                    throw new Error(`Codex needs attention: ${event.data.eventType}`);
                if (event.data.eventType === "item.started")
                    items++;
                if (event.data.eventType === "message.completed")
                    replies.push(String(event.data.payload.text ?? ""));
                if (event.data.eventType === "turn.completed") {
                    assert.equal(event.data.payload.turn
                        ?.status, "completed");
                    finished = true;
                }
            }
            assert.ok(items <= 120, "Codex exceeded the manual item bound");
            const run = (await state()).runs.find((run) => run.mode === "trial");
            if (run)
                await progress(run);
            return finished && harness.codexUsage.report().usageComplete;
        }, 20 * 60000, signal);
        await writeFile(path.join(output, "chat.txt"), redactManualText(`USER\n${experiment}\n\nASSISTANT\n${replies.join("\n\n")}`), { mode: 0o600 });
        check("Luna receives the browser message, creates the Idaho adapter and starts one trial");
        const trial = await waitFor("ten-record Idaho trial", async () => {
            assert.deepEqual(errors, []);
            const run = (await state()).runs.find((run) => run.mode === "trial");
            assert.ok(run, "Codex did not request a trial");
            await progress(run);
            return run.status === "completed" && run;
        }, 110 * 60000, signal);
        assert.equal(trial.inputCount, partnerRecords);
        assert.equal(trial.sample?.populationCount, 10);
        assert.deepEqual(trial.nodeIds, stages);
        assert.equal(trial.targetNodeId, undefined);
        await writeFile(path.join(output, "trial-run.json"), JSON.stringify(trial, null, 2), { mode: 0o600 });
        for (const id of stages)
            assert.equal(trial.nodeStates[id]?.status, "completed");
        for (const node of trial.graph.nodes.filter((node) => node.kind === "agent" && node.id !== "adapt-import")) {
            assert.equal(node.models.default, config.processingModel.id);
            assert.equal(node.reasoningEffort, config.processingReasoningEffort);
        }
        if (research) {
            for (const id of idahoResearchNodes) {
                if (!harness.processingCalls.some((call) => call.nodeId === id))
                    missingResearchCalls.push(id);
                const node = trial.graph.nodes.find((node) => node.id === id);
                for (const [key, value] of Object.entries(idahoResearchLimits))
                    assert.equal(node.configuration[key], value, `Codex changed the research limit ${id}.${key}`);
                assert.ok(trial.graph.edges.some((edge) => edge.source === "firecrawl" && edge.target === id));
            }
        }
        else
            assert.ok(!harness.processingCalls.some((call) => idahoResearchNodes.includes(call.nodeId)));
        assert.equal(harness.codexUsage.report().turns, 1);
        await expect(page
            .locator("yp-live-workflow-graph")
            .getByRole("region", { name: "Agent activity" })).toContainText("Run completed.");
        await screenshot("03-trial-complete");
        check(research
            ? "All configured stages report completion with the selected models and limits; record validation follows"
            : "All non-web stages finish with the configured model and reasoning settings");
        await button("Results").click();
        const results = page.locator("yp-live-workflow-results");
        await expect(results).toContainText("matching results");
        await results
            .getByText("Original, evidence and full record", { exact: true })
            .first()
            .click();
        await screenshot("04-trial-results");
        if (research) {
            await results
                .getByText("Original, evidence and full record", { exact: true })
                .first()
                .click();
            await results
                .getByText("License and legal research", { exact: true })
                .first()
                .click();
            for (const label of [
                "License and degree research",
                "Education and statute research",
            ]) {
                const summary = results
                    .locator("summary")
                    .filter({ hasText: `${label} ·` })
                    .first();
                if (await summary.count()) {
                    await summary.click();
                    await expect(summary.locator("..")).toHaveAttribute("open", "");
                }
            }
            await results
                .locator("article")
                .first()
                .screenshot({ path: path.join(output, "04-research-coverage.png") });
        }
        await button("Usage").click();
        await expect(page.getByRole("heading", { name: "Processing costs", exact: true })).toBeVisible();
        await screenshot("05-settled-usage");
        if (research) {
            await button("Refresh account credits").click();
            const usage = page.getByRole("region", { name: "Firecrawl usage" });
            await expect(usage).toContainText("account credits remaining");
            await usage.screenshot({
                path: path.join(output, "05-firecrawl-usage.png"),
            });
        }
        await button("Data").click();
        const snapshot = await state();
        const assets = snapshot.assets.filter((asset) => asset.name.startsWith(`${trial.id}-`) && !asset.stagePart);
        assert.ok(assets.length >= 6, "Missing trial artifacts");
        const rows = [];
        const exportArtifacts = new Map();
        let adapted;
        for (const asset of assets) {
            const bytes = await download(asset);
            if (asset.resultSet?.runId === trial.id)
                rows.push(...JSON.parse(bytes.toString()));
            if (asset.name.endsWith("-adapted-jobs.json"))
                adapted = JSON.parse(bytes.toString());
            const exportName = asset.name.slice(trial.id.length + 1);
            if (/^skills-first(?:-\d{4})?\.(json|csv|xlsx|md)$/.test(exportName))
                exportArtifacts.set(exportName, bytes);
            if (asset.name.endsWith(".csv"))
                assert.ok(parse(bytes, { columns: true, from_line: 2 }).length);
        }
        await writeFile(path.join(output, "last-run-results.json"), JSON.stringify(rows, null, 2), { mode: 0o600 });
        check("Every trial artifact is saved by the browser and verified against its checksum");
        const valueVerification = await collectPartnerExports({
            output,
            runId: trial.id,
            artifacts: exportArtifacts,
            records: rows,
            usage: await harness.request("/usage"),
        });
        verifyPartnerSelection(data, upload.id, trial, adapted, rows);
        let researchVerification;
        if (research) {
            researchVerification = verifyIdahoResearch(rows, await harness.request("/usage"), trial.id);
            await writeFile(path.join(output, "research-verification.json"), JSON.stringify(researchVerification, null, 2), { mode: 0o600 });
        }
        await writeFile(path.join(output, "value-verification.json"), JSON.stringify(valueVerification, null, 2), { mode: 0o600 });
        await button("Results").click();
        const descriptionSummaries = results.getByText("What the supplied description states", { exact: true });
        const descriptionsExpected = rows.filter((row) => Boolean(row.analysis
            ?.documentRequirements)).length;
        await expect(descriptionSummaries).toHaveCount(descriptionsExpected);
        if (descriptionsExpected) {
            await descriptionSummaries.first().click();
            await page.screenshot({
                path: path.join(output, "04-description-findings.png"),
                fullPage: true,
            });
        }
        // Preserve both diagnostics even when a research record failed. Downloading
        // an Excel file does not establish that its research or values are correct.
        assert.deepEqual(missingResearchCalls, [], "Some research agents made no model calls");
        if (researchVerification) {
            assert.equal(researchVerification.passed, true, JSON.stringify(researchVerification.issues));
            assert.ok(researchVerification.quotesVerified > 0, "No exact web evidence reached the pilot output");
            check("Research citations match settled retrievals for the same record and agent; incomplete evidence retains uncertainty");
        }
        assert.equal(valueVerification.passed, true, JSON.stringify(valueVerification.missingOrChangedValues));
        check("Provider findings survive canonical memory, all 74 CSV/Excel columns, document fields and review details");
        await button("Results").click();
        await expect(results.locator("article")).toHaveCount(rows.length);
        for (const row of rows) {
            const card = results.locator("article").filter({
                has: page.getByRole("heading", { name: String(row.name), exact: true }),
            });
            const details = card.locator("details").filter({
                has: page.getByText("Original, evidence and full record", {
                    exact: true,
                }),
            });
            if ((await details.getAttribute("open")) === null)
                await details.locator("summary").click();
            assert.deepEqual(JSON.parse(await details.locator("pre").innerText()), row, "Results UI lost saved fields");
            await details.locator("summary").click();
            const job = row;
            const fields = [
                ["Title code", job.titleCode],
                [
                    "Highest stated education",
                    job.degreeAnalysis.maximumDegreeRequirement,
                ],
                [
                    "Degree mandatory",
                    job.degreeAnalysis.degreeRequirementStatus.isDegreeMandatory,
                ],
                [
                    "Alternative qualifications",
                    job.degreeAnalysis.degreeRequirementStatus
                        .hasAlternativeQualifications,
                ],
                [
                    "License required",
                    job.degreeAnalysis.professionalLicenseRequirement.isLicenseRequired,
                ],
                [
                    "Estimated reading level",
                    job.readingLevelGradeAnalysis.readabilityLevel,
                ],
                [
                    "Reading level matches education",
                    job.readingLevelGradeAnalysis.readingLevelMatchesDegreeRequirement,
                ],
            ];
            for (const [label, value] of fields) {
                const displayed = value === null || value === undefined || value === ""
                    ? "Unknown"
                    : typeof value === "boolean"
                        ? value
                            ? "Yes"
                            : "No"
                        : String(value);
                await expect(card.getByText(label, { exact: true }).locator("..").locator("dd")).toHaveText(displayed);
            }
        }
        const firstCard = results.locator("article").first();
        for (const name of [
            "Degree paths and evidence",
            "Consistency and readability",
            "License and legal research",
        ]) {
            await firstCard.getByText(name, { exact: true }).click();
        }
        await firstCard
            .locator('section[aria-label="Skills First findings"]')
            .screenshot({ path: path.join(output, "04-detailed-findings.png") });
        check("Results UI retains full saved records and displays degree, license and reading-level values");
        await button("Data").click();
        const revision = await harness.request(`/revisions/${trial.sourceHash}`);
        const adapter = trial.graph.nodes.find((node) => node.id === "adapt-import");
        assert.ok(adapter.entrypoint && revision.files[adapter.entrypoint]);
        await writeFile(path.join(output, "adapter.ts"), revision.files[adapter.entrypoint]);
        await writeFile(path.join(output, "AGENTS.md"), revision.files["AGENTS.md"]);
        await writeFile(path.join(output, "graph.json"), JSON.stringify(trial.graph, null, 2));
        assert.deepEqual(errors, []);
        // Capture observations before report/verifier API reads can add their own evidence.
        const observed = [...evidence.requests];
        verifyPartnerBrowserActions(observed, downloads.map((item) => item.id));
        const costs = await saveIdahoCosts(harness, output, rows.map((row) => String(row.id)));
        await writeFile(path.join(output, "browser-evidence.json"), JSON.stringify({ checks, downloads, requests: observed }, null, 2), { mode: 0o600 });
        // Save costs and the workbook even when a real model fails a quality check.
        const quality = idahoQuality(rows);
        assert.equal(quality.analyzed, rows.length, "Every record must complete all seven analyses");
        assert.equal(quality.acceptedRewrites, rows.length, "Every rewrite must pass independent review");
        assert.ok(rows.every((row) => Array.isArray(row.errors) && row.errors.length === 0), "Processing errors require review");
        assert.equal(costs.totals.unresolvedRequests, 0);
        assert.equal(costs.unmatchedAnalysisRequests, 0);
        assert.equal((await state()).runs.length, 1);
        check("Exactly ten source parents preserve every field; all agents finish and no bulk run is created");
        return {
            checks,
            downloads,
            trialRunId: trial.id,
            quality,
            valueVerification,
            researchVerification,
            trialRecords: partnerRecords,
            population: partnerRecords,
            bulkApproved: false,
            actualProcessingMicros: costs.totals.settledMicros,
            codexEstimatedMicros: costs.codex.estimatedCostMicros,
            realBrowser: "Chromium",
        };
    }
    catch (error) {
        await screenshot("failure").catch(() => undefined);
        await writeFile(path.join(output, "browser-evidence.json"), JSON.stringify({ checks, downloads, requests: evidence.requests }, null, 2), { mode: 0o600 });
        await writeFile(path.join(output, "browser-error.json"), redactManualText(JSON.stringify({ error: String(error), errors, checks, downloads }, null, 2)), { mode: 0o600 });
        throw error;
    }
    finally {
        signal.removeEventListener("abort", abort);
        await browser.close();
    }
}
