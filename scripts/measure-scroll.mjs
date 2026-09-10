import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const baseURL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3001";
await mkdir("test-results", { recursive: true });
const browser = await chromium.launch();
const results = [];
for (const [name, viewport] of [
  ["desktop", { width: 1440, height: 900 }],
  ["mobile", { width: 390, height: 844 }],
]) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.addInitScript(() => {
    const metrics = {
      lcp: 0,
      cls: 0,
      longTasks: [],
      frameGaps: [],
      scrolling: false,
    };
    window.journeyMetrics = metrics;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) metrics.lcp = entry.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    let windowStart = 0;
    let lastShift = 0;
    let windowValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.hadRecentInput) continue;
        if (
          entry.startTime - lastShift < 1000 &&
          entry.startTime - windowStart < 5000
        )
          windowValue += entry.value;
        else {
          windowStart = entry.startTime;
          windowValue = entry.value;
        }
        lastShift = entry.startTime;
        metrics.cls = Math.max(metrics.cls, windowValue);
      }
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (metrics.scrolling) metrics.longTasks.push(entry.duration);
      }
    }).observe({ type: "longtask", buffered: true });
    let previous = 0;
    const frame = (time) => {
      if (metrics.scrolling && previous)
        metrics.frameGaps.push(time - previous);
      previous = time;
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  });
  await page.goto(baseURL);
  await page.getByRole("button", { name: "No thanks", exact: true }).click();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1800);
  await page.mouse.move(5, 5);
  await page.screenshot({ path: `test-results/${name}-hero.png` });
  await page.evaluate(() => {
    window.journeyMetrics.scrolling = true;
  });
  // Small wheel increments exercise entry/exit boundaries and reverse scrubbing.
  const height = await page.evaluate(
    () => document.documentElement.scrollHeight,
  );
  for (const direction of [1, -1]) {
    for (let distance = 0; distance < height; distance += 280) {
      await page.mouse.wheel(0, direction * 280);
      await page.waitForTimeout(100);
    }
  }
  await page.waitForTimeout(1000);
  const metrics = await page.evaluate(() => {
    const m = window.journeyMetrics;
    m.scrolling = false;
    const frames = m.frameGaps.sort((a, b) => a - b);
    return {
      lcpMs: Math.round(m.lcp),
      cls: Number(m.cls.toFixed(4)),
      scrollLongTasks: m.longTasks.length,
      maxScrollLongTaskMs: Math.round(Math.max(0, ...m.longTasks)),
      frameGapP95Ms: Math.round(frames[Math.floor(frames.length * 0.95)] ?? 0),
      overflow: document.documentElement.scrollWidth > innerWidth,
      videoRequests: performance
        .getEntriesByType("resource")
        .filter((r) => /\.mp4/.test(r.name)).length,
    };
  });
  if (name === "desktop") {
    for (const [label, selector, offset] of [
      ["passage", "#journey", 1250],
      ["stack", ".card-fund", 0],
      ["closing", "#contact", 100],
    ]) {
      await page
        .locator(selector)
        .evaluate(
          (el, offset) =>
            window.scrollTo(
              0,
              el.getBoundingClientRect().top + scrollY + offset,
            ),
          offset,
        );
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `test-results/${label}.png` });
    }
  } else {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: "test-results/mobile-full.png",
      fullPage: true,
    });
  }
  results.push({ name, viewport, ...metrics, errors });
  await page.close();
}
await browser.close();
await writeFile(
  "test-results/performance.json",
  JSON.stringify(results, null, 2) + "\n",
);
console.log(JSON.stringify(results, null, 2));
if (
  results.some(
    (result) =>
      result.cls > 0.1 ||
      result.overflow ||
      result.videoRequests ||
      result.errors.length,
  )
) {
  throw new Error("Scroll QA failed: inspect test-results/performance.json");
}
