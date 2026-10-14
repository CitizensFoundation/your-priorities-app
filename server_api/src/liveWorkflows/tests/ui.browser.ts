import { test, expect } from "@playwright/test";
test.beforeEach(async ({ request, page }) => {
  await request.post("/__fixture/reset");
  // The fixture suite may contact only the local server, never an account or provider.
  await page.route("**/*", (route) =>
    new URL(route.request().url()).origin === "http://127.0.0.1:54822"
      ? route.continue()
      : route.abort(),
  );
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Results", exact: true }),
  ).toBeVisible();
});
test("assistant controls discover capabilities, save independently, and persist after reload", async ({
  page,
  request,
}) => {
  const controls = page.locator("yp-live-workflow-assistant-settings");
  const settings = controls.getByRole("button", {
    name: "Assistant settings",
    exact: true,
  });
  const model = controls.getByRole("combobox", {
    name: "Assistant model",
    exact: true,
  });
  const effort = controls.getByRole("combobox", {
    name: "Reasoning effort",
    exact: true,
  });
  const speed = controls.getByRole("combobox", {
    name: "Response speed",
    exact: true,
  });
  await expect(controls.getByRole("dialog")).toBeHidden();
  await expect(settings).toContainText("test-codex · max");
  expect((await controls.boundingBox())!.height).toBeLessThan(44);
  await page
    .getByRole("textbox", {
      name: "Message Skills First Assistant",
      exact: true,
    })
    .fill("Keep this message while I choose a model.");
  await settings.click();
  await expect(model).toHaveValue("test-codex");
  await expect(effort).toHaveValue("max");
  await expect(speed).toHaveValue("regular");
  await controls
    .getByRole("button", { name: "Load models", exact: true })
    .click();
  await expect(controls.locator("datalist option")).toHaveCount(2);
  await model.fill("fixture-codex");
  await expect(controls.getByRole("alert")).toContainText(
    "Choose a reasoning effort",
  );
  await expect(page.locator(".composer button.primary")).toBeDisabled();
  await effort.selectOption("high");
  await expect(effort.locator("option")).toHaveCount(2);
  await speed.selectOption("fast");
  const before = (await (await request.get("/__fixture")).json()).snapshot;
  await controls
    .getByRole("button", { name: "Apply to next turn", exact: true })
    .click();
  await expect(controls.getByRole("status")).toContainText(
    "Saved for the next turn",
  );
  await expect(controls.getByRole("dialog")).toBeHidden();
  await expect(settings).toBeFocused();
  await expect(
    page.getByRole("button", { name: "Send", exact: true }),
  ).toBeEnabled();
  await expect(
    page.getByRole("textbox", {
      name: "Message Skills First Assistant",
      exact: true,
    }),
  ).toHaveValue("Keep this message while I choose a model.");
  const after = await (await request.get("/__fixture")).json();
  const saved = after.requests.find((r: { url: string }) =>
    r.url.endsWith("/assistant-settings"),
  );
  expect(saved.body).toEqual({
    settings: {
      model: "fixture-codex",
      reasoningEffort: "high",
      serviceTier: "fast",
    },
    expected: {
      model: "test-codex",
      reasoningEffort: "max",
      serviceTier: "regular",
    },
  });
  expect(after.snapshot.workspace.revision).toBe(before.workspace.revision);
  expect(after.snapshot.workspace.graph).toEqual(before.workspace.graph);
  expect(after.snapshot.runs).toEqual(before.runs);
  await page.reload();
  await expect(controls.getByRole("dialog")).toBeHidden();
  await settings.click();
  await expect(model).toHaveValue("fixture-codex");
  await expect(effort).toHaveValue("high");
  await expect(speed).toHaveValue("fast");
  await controls
    .getByRole("button", { name: "Close assistant settings", exact: true })
    .click();
  await page.getByRole("button", { name: "Settings", exact: true }).click();
  const admin = page.locator("yp-live-workflow-admin");
  await expect(
    admin.getByRole("combobox", { name: "Codex model", exact: true }),
  ).toHaveValue("fixture-codex");
  await expect(
    admin.getByRole("combobox", {
      name: "Codex reasoning effort",
      exact: true,
    }),
  ).toHaveValue("high");
  await expect(
    admin.getByRole("combobox", { name: "Codex response speed", exact: true }),
  ).toHaveValue("fast");
  // An admin form opened before a chat-side change must not overwrite it.
  await settings.click();
  await model.fill("test-codex");
  await controls
    .getByRole("button", { name: "Apply to next turn", exact: true })
    .click();
  await expect(controls.getByRole("status")).toContainText(
    "Saved for the next turn",
  );
  await admin
    .getByRole("button", { name: "Save workflow settings", exact: true })
    .click();
  await expect(admin.getByRole("alert")).toContainText(
    "Assistant settings changed",
  );
  await admin
    .getByRole("button", { name: "Reload saved settings", exact: true })
    .click();
  await expect(
    admin.getByRole("combobox", { name: "Codex model", exact: true }),
  ).toHaveValue("test-codex");
});
test("assistant settings change during a live turn without relabeling steering or previous messages", async ({
  page,
  request,
}) => {
  const controls = page.locator("yp-live-workflow-assistant-settings");
  const settings = controls.getByRole("button", {
    name: "Assistant settings",
    exact: true,
  });
  await request.post("/__fixture/assistant-active");
  await settings.click();
  await expect(controls.getByRole("status")).toContainText(
    "Running: test-codex · max reasoning · Standard",
  );
  await controls
    .getByRole("combobox", { name: "Assistant model", exact: true })
    .fill("fixture-codex");
  await controls
    .getByRole("combobox", { name: "Reasoning effort", exact: true })
    .selectOption("high");
  await controls
    .getByRole("combobox", { name: "Response speed", exact: true })
    .selectOption("fast");
  await controls
    .getByRole("button", { name: "Apply to next turn", exact: true })
    .click();
  await expect(settings).toHaveAttribute("title", /Running: test-codex/);
  await expect(settings).toContainText("Next turn");
  await expect(controls.getByRole("dialog")).toBeHidden();
  await expect(controls.getByText(/Saved for the next turn/)).toBeVisible();
  await controls.scrollIntoViewIfNeeded();
  await page.screenshot({
    path: "/tmp/skills-first-assistant-settings-compact.png",
    fullPage: true,
  });
  await settings.click();
  await expect(controls.getByText(/Running: test-codex/)).toBeVisible();
  await page.screenshot({
    path: "/tmp/skills-first-assistant-settings-dialog.png",
    fullPage: true,
  });
  await page.keyboard.press("Escape");
  await expect(controls.getByRole("dialog")).toBeHidden();
  await expect(settings).toBeFocused();
  const message = page.getByRole("textbox", {
    name: "Message Skills First Assistant",
    exact: true,
  });
  await message.fill("Steer with the original settings.");
  await page
    .getByRole("checkbox", { name: "Steer current turn", exact: true })
    .check();
  await page.getByRole("button", { name: "Send", exact: true }).click();
  await expect(
    page.getByText("Steering: test-codex · max reasoning · Standard", {
      exact: true,
    }),
  ).toBeVisible();
  await request.post("/__fixture/assistant-complete");
  await expect(settings).not.toHaveAttribute("title", /Running:/);
  await message.fill("Use the new settings for this message.");
  await page.getByRole("button", { name: "Send", exact: true }).click();
  await expect(
    page.getByText("Requested: fixture-codex · high reasoning · Fast", {
      exact: true,
    }),
  ).toBeVisible();
  await page.reload();
  await settings.click();
  await expect(controls.getByText(/Running: fixture-codex/)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByText("Steering: test-codex · max reasoning · Standard", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByText("Requested: fixture-codex · high reasoning · Fast", {
      exact: true,
    }),
  ).toBeVisible();
});
test("assistant settings preserve edits on failure, detect competing changes and support cancel", async ({
  page,
  request,
}) => {
  const controls = page.locator("yp-live-workflow-assistant-settings");
  const settings = controls.getByRole("button", {
    name: "Assistant settings",
    exact: true,
  });
  await settings.click();
  const model = controls.getByRole("combobox", {
    name: "Assistant model",
    exact: true,
  });
  const apply = controls.getByRole("button", {
    name: "Apply to next turn",
    exact: true,
  });
  await model.fill("fixture-codex");
  await page.route(
    "**/assistant-settings",
    (route) =>
      route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ error: "Settings temporarily unavailable" }),
      }),
    { times: 1 },
  );
  await apply.click();
  await expect(controls.getByRole("alert")).toHaveText(
    "Settings temporarily unavailable",
  );
  await expect(model).toHaveValue("fixture-codex");
  await expect(page.locator(".composer button.primary")).toBeDisabled();
  await request.post("/__fixture/assistant-settings", {
    data: { codexModel: "another-tab-model", codexReasoningEffort: "low" },
  });
  await expect(
    controls.getByText(/Assistant settings changed elsewhere/),
  ).toBeVisible();
  await expect(model).toHaveValue("fixture-codex");
  await expect(apply).toBeDisabled();
  await controls
    .getByRole("button", { name: "Reload settings", exact: true })
    .click();
  await expect(model).toHaveValue("another-tab-model");
  await expect(
    controls.getByRole("combobox", { name: "Reasoning effort", exact: true }),
  ).toHaveValue("low");
  await model.fill("cancel-me");
  await controls.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(controls.getByRole("dialog")).toBeHidden();
  await expect(settings).toContainText("another-tab-model");
  await expect(settings).toBeFocused();
  await settings.click();
  await model.fill("discard-with-escape");
  await page.keyboard.press("Escape");
  await expect(settings).toContainText("another-tab-model");
  await expect(
    page.getByRole("button", { name: "Send", exact: true }),
  ).toBeEnabled();
});
test("members can see assistant settings but cannot edit or load models", async ({
  page,
  request,
}) => {
  await request.post("/__fixture/member");
  await page.reload();
  const controls = page.locator("yp-live-workflow-assistant-settings");
  await controls
    .getByRole("button", { name: "Assistant settings", exact: true })
    .click();
  await expect(
    controls.getByRole("combobox", { name: "Assistant model", exact: true }),
  ).toBeDisabled();
  await expect(
    controls.getByRole("combobox", { name: "Reasoning effort", exact: true }),
  ).toBeDisabled();
  await expect(
    controls.getByRole("combobox", { name: "Response speed", exact: true }),
  ).toBeDisabled();
  await expect(
    controls.getByRole("button", { name: "Apply to next turn", exact: true }),
  ).toHaveCount(0);
  await expect(
    controls.getByRole("button", { name: "Load models", exact: true }),
  ).toHaveCount(0);
  await expect(
    controls.getByRole("button", {
      name: "Close assistant settings",
      exact: true,
    }),
  ).toBeEnabled();
});
test("review results: pagination, search, unknowns, children and trial comparison", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Results", exact: true }).click();
  const panel = page.locator("yp-live-workflow-results");
  await panel
    .getByRole("combobox", { name: "Result run", exact: true })
    .selectOption("33333333-3333-4333-8333-333333333333");
  await expect(panel.getByText("25 matching results")).toBeVisible();
  await expect(panel.locator("article")).toHaveCount(20);
  const findings = panel
    .getByRole("region", { name: "Skills First findings" })
    .first();
  await expect(findings).toBeVisible();
  await expect(findings).toContainText("Not checked");
  await expect(
    findings.getByText("Degree mandatory", { exact: true }).locator(".."),
  ).toContainText("No");
  await expect(
    findings.locator("dl > div").filter({ hasText: "License required" }),
  ).toContainText("Unknown");
  await findings
    .getByText("Degree paths and evidence", { exact: true })
    .click();
  await expect(findings).toContainText("Degree explanation unavailable");
  await findings
    .getByText("License and legal research", { exact: true })
    .click();
  await expect(findings.getByText(/No legal research results/)).toBeVisible();
  await panel.locator("article").first().screenshot({
    path: "/tmp/skills-first-format-review/results-findings.png",
  });
  await panel.getByRole("button", { name: "Next results" }).click();
  await expect(panel.locator("article")).toHaveCount(5);
  await panel
    .getByRole("textbox", { name: "Search results", exact: true })
    .fill("Technician 24");
  await panel.getByRole("button", { name: "Search", exact: true }).click();
  await expect(panel.locator("article")).toHaveCount(1);
  await panel
    .getByRole("textbox", { name: "Search results", exact: true })
    .fill("");
  await panel
    .getByRole("combobox", { name: "Show", exact: true })
    .selectOption("unknown");
  await expect(
    panel.getByRole("heading", { name: "Technician 1", exact: true }),
  ).toBeVisible();
  await panel
    .getByRole("combobox", { name: "Show", exact: true })
    .selectOption("failed");
  await expect(
    panel.getByText("Unsupported evidence", { exact: true }),
  ).toBeVisible();
  await panel
    .getByRole("combobox", { name: "Show", exact: true })
    .selectOption("children");
  await expect(panel.locator("article")).toHaveCount(2);
  await panel
    .getByRole("combobox", { name: "Compare with", exact: true })
    .selectOption("77777777-7777-4777-8777-777777777777");
  await expect(
    panel.getByText("Alternative model wording", { exact: true }),
  ).toHaveCount(2);
  await expect(panel.getByText(/Parent: Technician series/)).toHaveCount(4);
  await panel.getByText("Models by agent", { exact: true }).last().click();
  await expect(panel.locator("table").last()).toContainText(
    "fixture-previous-model",
  );
  await expect(panel.locator("table").last()).toContainText(
    "xhigh (model default)",
  );
  await page.screenshot({
    path: "/tmp/yp-workflow-results-review.png",
    fullPage: true,
  });
});
test("opening Results preserves the run selected in Agents, including after remount", async ({
  page,
}) => {
  const selectedRun = "77777777-7777-4777-8777-777777777777";
  await page
    .getByRole("combobox", { name: "Display", exact: true })
    .selectOption(selectedRun);
  await page.getByRole("button", { name: "Results", exact: true }).click();
  const panel = page.locator("yp-live-workflow-results");
  await expect(
    panel.getByRole("combobox", { name: "Result run", exact: true }),
  ).toHaveValue(selectedRun);
  await expect(
    panel.getByText("Alternative model wording", { exact: true }),
  ).toHaveCount(20);
  await page.getByRole("button", { name: "Agents", exact: true }).click();
  await page.getByRole("button", { name: "Results", exact: true }).click();
  await expect(
    panel.getByRole("combobox", { name: "Result run", exact: true }),
  ).toHaveValue(selectedRun);
  await expect(
    panel.getByText("Alternative model wording", { exact: true }),
  ).toHaveCount(20);
});
test("agent messages update live, filter by node and survive pause, refresh and completion", async ({
  page,
  request,
}) => {
  const graph = page.locator("yp-live-workflow-graph");
  const activity = graph.getByRole("region", { name: "Agent activity" });
  const latest = activity.getByRole("status");
  await expect(latest).toContainText("Checking degrees for Technician 2");
  await expect(latest).toContainText("2/5 records processed");
  await expect(latest.locator("time")).toHaveAttribute(
    "datetime",
    /^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/,
  );
  const message =
    "Checking evidence for Records Clerk <script>do not execute</script>";
  await request.post("/__fixture/agent-message", { data: { message } });
  await expect(latest).toContainText(message);
  await expect(graph.locator("script")).toHaveCount(0);
  const analyze = graph
    .getByRole("group", { name: "Live workflow agents and data connections" })
    .getByRole("button", { name: "Analyze requirements", exact: true });
  await expect(analyze).toHaveAttribute(
    "aria-description",
    `Running: ${message}`,
  );
  await analyze.focus();
  await analyze.press("Enter");
  await expect(analyze).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("dialog", { name: "Analyze requirements", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(analyze).toBeFocused();
  await activity
    .getByText("Recent messages · Analyze requirements (2)")
    .click();
  await expect(activity.locator("li")).toHaveCount(2);
  await expect(activity.locator("li").first()).toContainText(message);
  await expect(
    activity.locator("li").filter({ hasText: "Normalized 5 job descriptions" }),
  ).toHaveCount(0);
  await activity.getByRole("button", { name: "Show all agents" }).click();
  await expect(analyze).toHaveAttribute("aria-pressed", "false");
  await expect(activity.locator("li")).toHaveCount(3);
  await page.getByRole("button", { name: "pause", exact: true }).click();
  await expect(activity).toContainText("Processing is paused.");
  await expect(analyze).toHaveAttribute(
    "aria-description",
    `Paused: ${message}`,
  );
  await expect(latest.locator('[data-status="running"]')).toHaveCount(0);
  await expect(graph.locator(".flowing")).toHaveCount(0);
  await page.reload();
  await expect(activity).toContainText("Processing is paused.");
  await expect(latest).toContainText(message);
  await page
    .getByRole("button", { name: "Approve allowance and resume" })
    .click();
  await expect(analyze).toHaveAttribute(
    "aria-description",
    `Running: ${message}`,
  );
  await expect(graph.locator(".flowing")).toHaveCount(1);
  await request.post("/__fixture/agent-message", {
    data: { message: "Checking evidence for Records Clerk" },
  });
  await expect(
    latest.getByText("Checking evidence for Records Clerk", { exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: "/tmp/yp-workflow-agent-activity.png",
    fullPage: true,
  });
  await request.post("/__fixture/complete");
  await expect(activity).toContainText("Run completed.");
  await expect(latest).toContainText("Completed · 5/5 records processed");
  await expect(
    page.getByRole("combobox", { name: "Display", exact: true }),
  ).toHaveValue("33333333-3333-4333-8333-333333333333");
  await page
    .getByRole("combobox", { name: "Display", exact: true })
    .selectOption("77777777-7777-4777-8777-777777777777");
  await expect(activity).not.toContainText(message);
  await page
    .getByRole("combobox", { name: "Display", exact: true })
    .selectOption("draft");
  await expect(activity).toHaveCount(0);
});
test("agent model popup edits only the draft and keeps model history across runs", async ({
  page,
  request,
}) => {
  await page.setViewportSize({ width: 1440, height: 1200 });
  const analyze = page
    .locator("yp-live-workflow-graph")
    .getByRole("group", { name: "Live workflow agents and data connections" })
    .getByRole("button", { name: "Analyze requirements", exact: true });
  await analyze.click();
  const dialog = page.getByRole("dialog", {
    name: "Analyze requirements",
    exact: true,
  });
  await expect(
    dialog.getByRole("combobox", { name: "Processing model", exact: true }),
  ).toBeDisabled();
  const history = dialog.getByRole("region", { name: "Model history" });
  await expect(history).toContainText("fixture-previous-model");
  await expect(history).toContainText("xhigh (model default)");
  await history.getByRole("button", { name: /77777777/ }).click();
  await expect(
    dialog.getByRole("combobox", { name: "Processing model", exact: true }),
  ).toHaveValue("fixture-previous-model");
  await dialog
    .getByRole("button", { name: "Edit current draft", exact: true })
    .click();
  const processing = dialog.getByRole("combobox", {
    name: "Processing model",
    exact: true,
  });
  await expect(processing).toBeEnabled();
  await processing.selectOption("fixture-alternative");
  await dialog
    .getByRole("combobox", { name: "Review model", exact: true })
    .selectOption("fixture-model");
  await dialog
    .getByRole("combobox", { name: "Agent reasoning effort", exact: true })
    .selectOption("high");
  await dialog
    .getByRole("spinbutton", {
      name: "Agent spending cap (USD, optional)",
      exact: true,
    })
    .fill("12.50");
  await request.post("/__fixture/complete");
  await expect(
    history.getByRole("row").filter({ hasText: "33333333" }),
  ).toContainText("completed");
  await expect(processing).toHaveValue("fixture-alternative");
  await expect(dialog).toContainText(
    "$3.00 input / $9.00 output per 1M tokens",
  );
  await page.screenshot({
    path: "/tmp/yp-workflow-agent-models.png",
    fullPage: true,
  });
  await dialog
    .getByRole("button", { name: "Save agent settings", exact: true })
    .click();
  await expect(dialog).toHaveCount(0);
  const data = await (await request.get("/__fixture")).json();
  const update = data.requests.find((r: any) => r.url.endsWith("/graph"));
  expect(update.body.revision).toBe(1);
  expect(
    update.body.graph.nodes.find((n: any) => n.id === "analyze"),
  ).toMatchObject({
    models: { default: "fixture-alternative", review: "fixture-model" },
    reasoningEffort: "high",
    budgetMicros: 12_500_000,
  });
  expect(
    update.body.graph.nodes.find((n: any) => n.id === "levels").models.default,
  ).toBe("fixture-model");
  expect(data.snapshot.workspace.config.codexModel).toBe("test-codex");
  expect(
    data.snapshot.runs[0].graph.nodes.find((n: any) => n.id === "analyze")
      .models.default,
  ).toBe("fixture-model");
  await page.reload();
  await page
    .getByRole("combobox", { name: "Display", exact: true })
    .selectOption("draft");
  await analyze.click();
  await expect(processing).toHaveValue("fixture-alternative");
  await expect(
    dialog.getByRole("combobox", { name: "Review model", exact: true }),
  ).toHaveValue("fixture-model");
  await history.getByRole("button", { name: /33333333/ }).click();
  await expect(processing).toHaveValue("fixture-model");
  await expect(processing).toBeDisabled();
  await expect(dialog).toContainText("max (model default)");
  await dialog.getByRole("button", { name: "Close agent settings" }).click();
  await expect(analyze).toBeFocused();
});
test("agent popup preserves edits during live refresh and rejects stale draft saves", async ({
  page,
  request,
}) => {
  await page
    .getByRole("combobox", { name: "Display", exact: true })
    .selectOption("draft");
  await page
    .locator("yp-live-workflow-graph")
    .getByRole("group", { name: "Live workflow agents and data connections" })
    .getByRole("button", { name: "Analyze requirements", exact: true })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Analyze requirements",
    exact: true,
  });
  const processing = dialog.getByRole("combobox", {
    name: "Processing model",
    exact: true,
  });
  await processing.selectOption("fixture-alternative");
  await request.post("/__fixture/draft-change");
  await expect(dialog.getByRole("alert")).toContainText("draft changed");
  await expect(processing).toHaveValue("fixture-alternative");
  await expect(
    dialog.getByRole("button", { name: "Save agent settings" }),
  ).toBeDisabled();
  await dialog.getByRole("button", { name: "Reload current draft" }).click();
  await expect(processing).toHaveValue("fixture-model");
  await expect(
    dialog.getByRole("button", { name: "Save agent settings" }),
  ).toBeEnabled();
  await processing.selectOption("fixture-alternative");
  await page.keyboard.press("Escape");
  const data = await (await request.get("/__fixture")).json();
  expect(
    data.requests.filter((r: any) => r.url.endsWith("/graph")),
  ).toHaveLength(0);
});
test("chat uses the signed-in profile and safely formats Codex replies", async ({
  page,
  request,
}) => {
  await expect(
    page.getByRole("heading", {
      name: "Talk with Skills First Assistant",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("textbox", {
      name: "Message Skills First Assistant",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page
      .locator("yp-live-workflow-message")
      .getByText("Skills First Assistant", { exact: true }),
  ).toBeVisible();
  const userMessage = page.locator("yp-live-workflow-message").filter({
    hasText: "Review these job descriptions and propose a small trial.",
  });
  await expect(
    userMessage.getByRole("img", { name: "Alex Morgan profile image" }),
  ).toBeVisible();
  await expect(userMessage.locator("img")).toHaveAttribute(
    "src",
    "/fixture-avatar.svg",
  );
  await expect(
    page
      .locator("yp-live-workflow-message strong")
      .getByText("five job descriptions", { exact: true }),
  ).toBeVisible();
  await request.post("/__fixture/chat-message", {
    data: {
      text: '**Ready to review**\n\n- First record\n- Second record\n\n[Source](https://example.com/source) [Unsafe](javascript:alert(1))\n\n<script>window.chatXss = true</script><img src="/missing" onerror="window.chatXss = true"><a href="https://example.com" onclick="window.chatXss = true">Link</a>',
    },
  });
  const reply = page
    .locator("yp-live-workflow-message")
    .filter({ hasText: "Ready to review" });
  await expect(
    reply.locator("strong").getByText("Ready to review", { exact: true }),
  ).toBeVisible();
  await expect(reply.locator("li")).toHaveCount(2);
  await expect(
    reply.getByRole("link", { name: "Source", exact: true }),
  ).toHaveAttribute("rel", "noopener noreferrer");
  await expect(
    reply.locator("script, img, [onclick], [onerror], [href^='javascript:']"),
  ).toHaveCount(0);
  expect(
    await page.evaluate(() => Reflect.get(globalThis, "chatXss")),
  ).toBeUndefined();
  // Login updates replace the image; another operator's historical messages keep their identity.
  await page.evaluate(() =>
    Reflect.get(globalThis, "document").dispatchEvent(
      new CustomEvent("yp-logged-in", {
        detail: { id: 10, name: "Alex Morgan", UserProfileImages: [] },
      }),
    ),
  );
  await expect(userMessage.locator("img")).toHaveCount(0);
  await expect(userMessage.getByText("AM", { exact: true })).toBeVisible();
  await page.evaluate(() =>
    Reflect.get(globalThis, "document").dispatchEvent(
      new CustomEvent("yp-logged-in", {
        detail: { id: 20, name: "Another User", UserProfileImages: [] },
      }),
    ),
  );
  await expect(
    userMessage.getByText("Group operator", { exact: true }),
  ).toBeVisible();
  await expect(
    userMessage.getByText("Another User", { exact: true }),
  ).toHaveCount(0);
  await page.evaluate(() =>
    Reflect.get(globalThis, "document").dispatchEvent(
      new CustomEvent("yp-logged-in", { detail: null }),
    ),
  );
  await expect(
    userMessage.getByText("Group operator", { exact: true }),
  ).toBeVisible();
});
test("graph can fit and zoom while chat and controls fit a narrow screen", async ({
  page,
}) => {
  const graph = page.locator("yp-live-workflow-graph");
  await graph.getByRole("button", { name: "Fit", exact: true }).click();
  const canvas = graph.getByRole("group", {
    name: "Live workflow agents and data connections",
  });
  expect(
    await canvas.evaluate(
      (element) => element.scrollWidth <= element.clientWidth + 1,
    ),
  ).toBe(true);
  const fitZoom = await graph.locator(".zoom-value").textContent();
  await graph.getByRole("button", { name: "Zoom in", exact: true }).click();
  await expect(graph.locator(".zoom-value")).not.toHaveText(fitZoom!);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(
    page.getByRole("heading", {
      name: "Talk with Skills First Assistant",
      exact: true,
    }),
  ).toBeVisible();
  expect(
    await page
      .locator("html")
      .evaluate((element) => element.scrollWidth <= element.clientWidth),
  ).toBe(true);
  await graph.getByRole("button", { name: "Fit", exact: true }).click();
  await page.screenshot({
    path: "/tmp/yp-workflow-mobile.png",
    fullPage: true,
  });
  await graph
    .getByRole("group", { name: "Live workflow agents and data connections" })
    .getByRole("button", { name: "Analyze requirements", exact: true })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Analyze requirements",
    exact: true,
  });
  expect(
    await dialog.evaluate(
      (element) => element.scrollWidth <= element.clientWidth,
    ),
  ).toBe(true);
  const bounds = await dialog.boundingBox();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(390);
  await page.screenshot({ path: "/tmp/yp-workflow-agent-models-mobile.png" });
  await page.keyboard.press("Escape");
});
test("connections, binary uploads and targeted trials", async ({
  page,
  request,
}) => {
  await request.post("/__fixture/complete");
  await page.reload();
  await page.getByRole("button", { name: "Data", exact: true }).click();
  await page
    .getByRole("button", { name: "Approve connection", exact: true })
    .click();
  await expect(page.getByText("Pilot jobs", { exact: true })).toBeVisible();
  await page
    .getByRole("button", { name: "Test connection", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Import a version", exact: true })
    .click();
  await expect(
    page.getByRole("link", { name: "pilot-import.json" }),
  ).toBeVisible();
  await page.locator("input[type=file]").setInputFiles({
    name: "uploaded-jobs.csv",
    mimeType: "text/csv",
    buffer: Buffer.from("name,text\nNew job,Description\n"),
  });
  await expect(
    page.getByRole("link", { name: "uploaded-jobs.csv" }),
  ).toBeVisible();
  await page.getByLabel("Trial records", { exact: true }).fill("2");
  await page.getByLabel("Trial records", { exact: true }).press("Tab");
  await page.getByLabel("Experiment scope").selectOption("analyze");
  await page.getByRole("button", { name: "Run 2-record trial" }).click();
  await expect(
    page.getByText("trial · running", { exact: true }),
  ).toBeVisible();
  const { requests } = await (await request.get("/__fixture")).json();
  expect(requests.find((r: any) => r.url.endsWith("/runs")).body).toMatchObject(
    {
      mode: "trial",
      sampleCount: 2,
      targetNodeId: "analyze",
    },
  );
});
test("explicit bulk approval, pause and allowance-controlled resume", async ({
  page,
  request,
}) => {
  await request.post("/__fixture/complete");
  await page.reload();
  await page.getByRole("button", { name: "Data", exact: true }).click();
  await page.locator("input[type=file]").setInputFiles({
    name: "bulk.json",
    mimeType: "application/json",
    buffer: Buffer.from('[{"id":"one"}]'),
  });
  await page.getByRole("button", { name: "Estimate full run" }).click();
  await page
    .getByLabel("Maximum approved spend (USD)", { exact: true })
    .fill("1.25");
  await page
    .getByRole("button", { name: "Approve and start this revision" })
    .click();
  await page.getByRole("button", { name: "pause", exact: true }).click();
  await page
    .getByLabel("Approved total run cap (USD)", { exact: true })
    .fill("2.50");
  await page
    .getByRole("button", { name: "Approve allowance and resume" })
    .click();
  await expect(page.getByText("bulk · running", { exact: true })).toBeVisible();
  const { requests } = await (await request.get("/__fixture")).json();
  expect(
    requests.find((r: any) => r.url.endsWith("/start")).body.budgetMicros,
  ).toBe(1_250_000);
  expect(
    requests.find((r: any) => r.url.endsWith("/resume")).body.budgetMicros,
  ).toBe(2_500_000);
});
test("Codex questions and event replay after a disconnected stream", async ({
  page,
  request,
}) => {
  await page
    .locator("textarea[name=message]")
    .fill("Plan a fixture experiment");
  await page.getByRole("button", { name: "Send", exact: true }).click();
  await page
    .getByLabel("Which jurisdiction should this trial use?")
    .fill("New Jersey");
  await page.getByRole("button", { name: "Send answers" }).click();
  await expect(
    page.getByText("Skills First Assistant needs your input", { exact: true }),
  ).toHaveCount(0);
  await request.post("/__fixture/reconnect");
  await expect(
    page.getByText("Reconnected fixture update", { exact: true }),
  ).toHaveCount(1);
});
test("completed Codex messages ignore late deltas during live delivery and history replay", async ({
  page,
  request,
}) => {
  await request.post("/__fixture/late-message");
  const reply = page.getByText("The trial is ready for review.", {
    exact: true,
  });
  await expect(reply).toHaveCount(1);
  await page.reload();
  await expect(reply).toHaveCount(1);
  await expect(
    page.getByText("The trial is ready for review.is ready for review.", {
      exact: true,
    }),
  ).toHaveCount(0);
});
test("members can review results but cannot operate or approve connections", async ({
  page,
  request,
}) => {
  await request.post("/__fixture/member");
  await page.reload();
  await page
    .locator("yp-live-workflow-graph")
    .getByRole("group", { name: "Live workflow agents and data connections" })
    .getByRole("button", { name: "Analyze requirements", exact: true })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Analyze requirements",
    exact: true,
  });
  await expect(
    dialog.getByRole("combobox", { name: "Processing model", exact: true }),
  ).toBeDisabled();
  await expect(
    dialog.getByRole("button", { name: "Edit current draft", exact: true }),
  ).toHaveCount(0);
  await expect(
    dialog.getByRole("button", { name: "Save agent settings", exact: true }),
  ).toHaveCount(0);
  await dialog.getByRole("button", { name: "Close agent settings" }).click();
  await expect(
    page.getByRole("button", { name: "Settings", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Data", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Approve connection", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByText("Waiting for an administrator to review."),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Run .*record trial/ }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Results", exact: true }).click();
  await expect(
    page.locator("yp-live-workflow-results").getByText("25 matching results"),
  ).toBeVisible();
});
