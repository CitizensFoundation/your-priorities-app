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
    page.getByText("Codex needs your input", { exact: true }),
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
