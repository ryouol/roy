import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  timeout: 120_000,
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: process.env.QA_BASE_URL ?? "http://127.0.0.1:3000",
    viewport: { width: 1440, height: 900 },
    // Headless Chromium otherwise selects SwiftShader on macOS, which cannot
    // keep up with the terrain and gives misleading animation timeouts.
    launchOptions: {
      args: process.platform === "darwin" ? ["--use-angle=metal"] : [],
    },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  reporter: [["list"], ["html", { open: "never" }]],
});
