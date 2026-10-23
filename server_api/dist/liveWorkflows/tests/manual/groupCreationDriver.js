/** On-demand Chromium driver. All mutations go through the production UI. */
import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, expect as playwrightExpect, } from "@playwright/test";
import { browserKeyMarker } from "./browserKeyImport.js";
import { redactManualText } from "./environment.js";
import { waitFor } from "./harness.js";
const expect = playwrightExpect.configure({ timeout: 30000 });
export async function driveGroupCreation(harness, config, output, marker, headed, signal, continuation) {
    assert.ok(harness.groupCreation);
    const budgetMicros = continuation?.budgetMicros ?? 0;
    assert.ok(Number.isSafeInteger(budgetMicros) && budgetMicros >= 0);
    const browser = await chromium.launch({ headless: !headed });
    const context = await browser.newContext({
        viewport: { width: 1440, height: 1100 },
    });
    const page = await context.newPage();
    page.setDefaultTimeout(30000);
    const abort = () => {
        void context.close().catch(() => undefined);
    };
    signal.addEventListener("abort", abort, { once: true });
    const errors = [];
    const checks = [];
    const requests = [];
    const expectedFailures = [];
    let workspaceCreated = false;
    page.on("pageerror", (error) => errors.push(redactManualText(error.message)));
    page.on("response", (response) => {
        if (!response.url().startsWith(`${harness.baseUrl}/api/`))
            return;
        const route = new URL(response.url()).pathname;
        requests.push({
            method: response.request().method(),
            path: route,
            status: response.status(),
        });
        const expected = expectedFailures.findIndex((item) => item.path === route &&
            item.status === response.status() &&
            item.method === response.request().method());
        if (expected >= 0) {
            expectedFailures.splice(expected, 1);
            return;
        }
        // Loading a saved group before creating its workspace legitimately returns 404.
        if (response.status() >= 400 &&
            !(response.status() === 404 &&
                !workspaceCreated &&
                /^\/api\/live-workflows\/groups\/\d+$/.test(route)))
            errors.push(`${route}: ${response.status()}`);
    });
    await context.route("**/*", async (route) => {
        // The normal group form's empty-logo image is hosted on S3. Keep the
        // rehearsal local without replacing any application API response.
        if (route.request().url() ===
            "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/ypPlaceHolder2.jpg") {
            await route.fulfill({
                contentType: "image/svg+xml",
                body: '<svg xmlns="http://www.w3.org/2000/svg" width="432" height="243"><rect width="432" height="243" fill="#dce5f5"/><text x="216" y="126" text-anchor="middle" fill="#304770" font-family="sans-serif" font-size="24">Workflow test group</text></svg>',
            });
            return;
        }
        if (new URL(route.request().url()).origin !== harness.baseUrl) {
            const url = new URL(route.request().url());
            errors.push(`Unexpected external browser request: ${url.origin}${url.pathname}`);
            await route.abort();
        }
        else
            await route.continue();
    });
    const state = () => harness.request("");
    const check = async (name) => {
        assert.deepEqual(errors, [], "Browser exceptions or failed API requests");
        assert.deepEqual(expectedFailures, [], "Expected failure did not reach the browser");
        checks.push({ name, at: new Date().toISOString() });
        await writeFile(path.join(output, "browser-checks.json"), JSON.stringify({ checks, requests }, null, 2), { mode: 0o600 });
        console.info(`[browser-create-group] PASS: ${name}`);
    };
    let screenshots = 0;
    const screenshot = async (name) => {
        await page.screenshot({ path: path.join(output, name), fullPage: true });
        screenshots++;
    };
    const workflow = page.locator("yp-live-workflow");
    const button = (name) => workflow.getByRole("button", { name, exact: true });
    try {
        signal.throwIfAborted();
        assert.equal(harness.groupCreation.groupId(), undefined);
        assert.equal((await harness.service.store.groups()).length, 0);
        await page.goto(harness.baseUrl);
        await page
            .getByRole("link", { name: "Create a new group", exact: true })
            .click();
        const form = page.locator("yp-admin-config-group");
        await expect(form.locator("#name").locator("input")).toBeVisible();
        await form
            .locator("#name")
            .locator("input")
            .fill(`Skills First browser ${marker}`);
        await form
            .locator("#description")
            .locator("textarea")
            .fill("Disposable group creation and assistant greeting test.");
        const groupType = form
            .locator("md-outlined-select")
            .filter({ hasText: "Live Workflow" });
        await groupType.click();
        await groupType
            .getByRole("option", { name: "Live Workflow", exact: true })
            .click();
        await expect(form.locator('input[name="groupType"]')).toHaveValue("5");
        await expect(form.locator("yp-live-workflow-admin")).toHaveCount(0);
        assert.equal((await harness.service.store.groups()).length, 0);
        await screenshot("01-new-group.png");
        await check("Selected Live Workflow in the real new-group form; unsaved group has no workflow setup");
        const created = page.waitForResponse((response) => response.url() ===
            `${harness.baseUrl}/api/groups/${harness.groupCreation.communityId}` &&
            response.request().method() === "POST");
        await form.locator(".saveButton").click();
        const response = await created;
        assert.equal(response.status(), 200);
        const group = (await response.json());
        assert.equal(Number(group.configuration.groupType), 5);
        assert.notEqual(group.id, 1, "Exercise a newly allocated ID, not the old hard-coded group fixture");
        await expect(page).toHaveURL(`${harness.baseUrl}/group/${group.id}`);
        await expect(workflow.getByRole("heading", { name: "Live workflow setup" })).toBeVisible();
        const persistedGroup = await harness.groupCreation.verify();
        assert.equal(persistedGroup.groupId, group.id);
        await check("Production group route persisted the group, membership and admin access, then opened its workflow setup");
        const settings = workflow.locator("yp-live-workflow-admin");
        await settings
            .locator('select[name="package"]')
            .selectOption("skills-first");
        await expect(settings.locator('select[name="host"] option')).toHaveCount(1);
        const hostId = await settings.locator('select[name="host"]').inputValue();
        await settings.locator('input[name="model"]').fill(config.codexModel);
        await settings
            .locator('select[name="reasoningEffort"]')
            .selectOption(config.codexReasoningEffort);
        await settings
            .locator('select[name="serviceTier"]')
            .selectOption(config.codexServiceTier);
        await settings
            .locator('input[name="budget"]')
            .fill(String(budgetMicros / 1e6));
        await settings
            .locator('input[name="trial"]')
            .fill(String(budgetMicros / 1e6));
        await settings.locator('input[name="quota"]').fill("1");
        await settings.locator('input[name="concurrency"]').fill("1");
        await screenshot("02-workspace-settings.png");
        await settings
            .getByRole("button", { name: "Create live workspace", exact: true })
            .click();
        await expect(workflow.getByRole("heading", {
            name: "Talk with Skills First Assistant",
        })).toBeVisible({ timeout: 180000 });
        workspaceCreated = true;
        const initial = await state();
        assert.equal(initial.workspace.groupId, group.id);
        assert.equal(initial.workspace.config.hostId, hostId);
        assert.equal(initial.workspace.config.packageId, "skills-first");
        assert.equal(initial.workspace.config.budgetMicros, budgetMicros);
        assert.equal(initial.workspace.config.trialBudgetMicros, budgetMicros);
        assert.equal(initial.workspace.config.codexModel, config.codexModel);
        assert.equal(initial.workspace.config.codexReasoningEffort, config.codexReasoningEffort);
        assert.equal(initial.workspace.config.codexServiceTier, config.codexServiceTier);
        assert.deepEqual(await harness.service.store.groups(), [group.id]);
        const root = harness.service.root(initial.workspace);
        const instructions = await readFile(path.join(root, "workspace", "AGENTS.md"), "utf8");
        assert.match(instructions, /Skills First/);
        await page.reload();
        await expect(workflow.getByRole("heading", {
            name: "Talk with Skills First Assistant",
        })).toBeVisible();
        assert.equal((await state()).workspace.id, initial.workspace.id);
        await check("Skills First setup, model settings and private VM workspace survive a full page reload");
        await button("Take operator control").click();
        await expect(button("Take operator control")).toBeDisabled();
        await workflow.getByText("Use an OpenAI API key", { exact: true }).click();
        await workflow
            .getByRole("textbox", { name: "OpenAI API key", exact: true })
            .fill(browserKeyMarker);
        await button("Connect API key").click();
        await expect(workflow.getByText("OpenAI API key connected", { exact: true })).toBeVisible({ timeout: 180000 });
        assert.equal((await state()).codexAuthMode, "api-key");
        await screenshot("03-connected-workspace.png");
        await check("Operator control and server-side key import use the new group's normal login route");
        const prompt = `Hello! Reply with exactly ${marker}. Do not use tools or start any agents.`;
        let cursor = (await state()).workspace.nextEvent;
        let completed = false;
        const replies = [];
        await workflow
            .getByRole("textbox", {
            name: "Message Skills First Assistant",
            exact: true,
        })
            .fill(prompt);
        await button("Send").click();
        await waitFor("one completed Codex greeting", async () => {
            assert.deepEqual(errors, []);
            const { events } = await harness.request(`/events?after=${cursor}`);
            cursor = events.at(-1)?.seq ?? cursor;
            for (const event of events) {
                if (event.type !== "session.event")
                    continue;
                const type = event.data.eventType;
                if (type === "approval.requested" || type === "session.error")
                    throw new Error(`Greeting requires attention: ${type}`);
                if (type === "message.completed")
                    replies.push(String(event.data.payload.text ?? ""));
                if (type === "turn.completed") {
                    assert.equal(event.data.payload.turn
                        ?.status, "completed");
                    completed = true;
                }
            }
            const usage = harness.codexUsage.report();
            return completed && usage.turns === 1 && usage.usageComplete;
        }, 5 * 60000, signal);
        assert.equal(replies.join("\n").trim(), marker);
        await expect(workflow
            .locator("yp-live-workflow-message .assistant")
            .getByText(marker, { exact: true })).toBeVisible();
        await writeFile(path.join(output, "chat.txt"), redactManualText(`USER\n${prompt}\n\nASSISTANT\n${replies.join("\n")}`), { mode: 0o600 });
        await screenshot("04-codex-reply.png");
        await check("One bounded Codex turn streamed a verified reply through the group's chat UI");
        await page.reload();
        await expect(workflow
            .locator("yp-live-workflow-message .assistant")
            .getByText(marker, { exact: true })).toBeVisible();
        await button("Settings").click();
        await expect(settings.locator('input[name="model"]')).toHaveValue(config.codexModel);
        await expect(settings.locator('select[name="reasoningEffort"]')).toHaveValue(config.codexReasoningEffort);
        await expect(settings.locator('select[name="serviceTier"]')).toHaveValue(config.codexServiceTier);
        await screenshot("05-reloaded-chat-and-settings.png");
        await page.goto(`${harness.baseUrl}/admin/group/${group.id}`);
        const groupAdmin = page.locator("yp-admin-config-group");
        const savedSettings = groupAdmin.locator("yp-live-workflow-admin");
        await expect(groupAdmin.locator('input[name="groupType"]')).toHaveValue("5");
        await expect(savedSettings.getByRole("button", {
            name: "Save workflow settings",
            exact: true,
        })).toBeVisible();
        await expect(savedSettings.locator('input[name="model"]')).toHaveValue(config.codexModel);
        await expect(savedSettings.locator('select[name="host"]')).toHaveValue(hostId);
        await screenshot("06-group-administration.png");
        await check("The normal group administration form recognizes the saved Live Workflow type and existing workspace");
        const final = await state();
        assert.equal(final.workspace.id, initial.workspace.id);
        assert.equal(final.workspace.spentMicros, 0);
        assert.equal(final.workspace.reservedMicros, 0);
        assert.equal(final.runs.length, 0);
        assert.equal(final.assets.length, 0);
        assert.equal(harness.processingCalls.length, 0);
        assert.equal(harness.codexCalls.length, 0, "Greeting must not invoke workflow tools");
        assert.equal(harness.codexUsage.report().turns, 1);
        assert.equal(requests.filter((r) => r.method === "POST" &&
            r.path === `/api/groups/${persistedGroup.communityId}`).length, 1);
        assert.equal(requests.filter((r) => r.method === "POST" &&
            r.path === `/api/live-workflows/groups/${group.id}`).length, 1);
        assert.ok(!requests.some((r) => /\/groups\/-1(?:\/|$)/.test(r.path)));
        await check("Reload restores chat and settings without recreating the group, duplicating Codex turns or running processing agents");
        let scenario;
        if (continuation) {
            await page.goto(`${harness.baseUrl}/group/${group.id}`);
            scenario = await continuation.run({
                page,
                groupId: group.id,
                check,
                screenshot,
                expectFailure: (method, route, status) => {
                    expectedFailures.push({ method, path: route, status });
                },
            });
            await check("Regression scenario finished with all expected responses accounted for");
        }
        const finished = await state();
        return {
            ...persistedGroup,
            workspaceId: initial.workspace.id,
            hostId,
            processingSpentMicros: finished.workspace.spentMicros,
            processingCalls: harness.processingCalls.length,
            groupCreationThroughProductionRouter: true,
            browserScreenshots: screenshots,
            ...(scenario ? { scenario } : {}),
            checks,
        };
    }
    catch (error) {
        await screenshot("failure.png").catch(() => undefined);
        await writeFile(path.join(output, "browser-error.json"), redactManualText(JSON.stringify({ error: String(error), errors, requests, checks }, null, 2)), { mode: 0o600 });
        throw error;
    }
    finally {
        signal.removeEventListener("abort", abort);
        await context.close().catch(() => undefined);
        await browser.close();
    }
}
