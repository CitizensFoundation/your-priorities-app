import { defineConfig } from "@playwright/test";
const port = Number(process.env.YP_WORKFLOW_UI_TEST_PORT ?? 54822);
export default defineConfig({
  testDir: ".",
  testMatch: "ui.browser.ts",
  workers: 1,
  retries: 0,
  timeout: 30_000,
  reporter: "list",
  outputDir: "/tmp/yp-workflow-browser-results",
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    browserName: "chromium",
    headless: true,
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run preview:live-workflows",
    cwd: process.cwd(),
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
    gracefulShutdown: { signal: "SIGTERM", timeout: 3000 },
  },
});
