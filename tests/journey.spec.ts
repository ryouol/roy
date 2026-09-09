import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function ready(page: Page, path = "/") {
  await page.goto(path);
  await page.getByRole("button", { name: "No thanks", exact: true }).click();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1500);
}
async function scroll(page: Page, y: number) {
  await page.evaluate((top) => window.scrollTo(0, top), y);
  await page.waitForTimeout(1000);
}
async function top(page: Page, selector: string) {
  return page
    .locator(selector)
    .evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
}

test("desktop journey: reversible parallax, pinned states, stack, no overflow or errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await ready(page);
  await expect(page.locator("html")).toHaveClass(/lenis/);
  const original = await page
    .locator(".hero .landscape-picture")
    .evaluate((el) => getComputedStyle(el).transform);
  await scroll(page, 350);
  expect(
    await page
      .locator(".hero .landscape-picture")
      .evaluate((el) => getComputedStyle(el).transform),
  ).not.toBe(original);
  await scroll(page, 0);
  expect(
    await page
      .locator(".hero .landscape-picture")
      .evaluate((el) => getComputedStyle(el).transform),
  ).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
  const storyTop = await top(page, ".story");
  await scroll(page, storyTop + 50);
  const frameY = await page
    .locator(".story-frame")
    .evaluate((el) => el.getBoundingClientRect().top);
  expect(Math.abs(frameY)).toBeLessThan(3);
  await scroll(page, storyTop + 1250);
  expect(
    Math.abs(
      await page
        .locator(".story-frame")
        .evaluate((el) => el.getBoundingClientRect().top),
    ),
  ).toBeLessThan(3);
  await expect(page.locator(".story-step").nth(1)).toHaveCSS("opacity", "1");
  await scroll(page, storyTop + 2150);
  await expect(page.locator(".story-step").nth(2)).toHaveCSS("opacity", "1");
  await scroll(page, storyTop + 50);
  await expect(page.locator(".story-step").first()).toHaveCSS("opacity", "1");
  await scroll(page, (await top(page, ".project-card:nth-child(2)")) - 120);
  expect(
    await page
      .locator(".project-card")
      .first()
      .evaluate((el) => getComputedStyle(el).transform),
  ).not.toBe("none");
  for (const card of await page.locator(".project-card").all())
    await expect(card).toHaveCSS("opacity", "1");
  const height = await page.evaluate(
    () => document.documentElement.scrollHeight,
  );
  for (let y = 0; y < height; y += 700) {
    await scroll(page, y);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  await page.screenshot({ path: "test-results/desktop-end.png" });
  await scroll(page, 0);
  await page.screenshot({ path: "test-results/desktop-hero.png" });
  expect(errors).toEqual([]);
});

test("mobile: natural flow, navigation focus trap, media, terminal and no overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveClass(/lenis/);
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.locator(".mobile-menu")).toBeVisible();
  for (let i = 0; i < 7; i++) await page.keyboard.press("Tab");
  expect(
    await page.evaluate(() => !!document.activeElement?.closest("dialog")),
  ).toBe(true);
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Selected work" })
    .click();
  await expect(page.locator(".mobile-menu")).not.toBeVisible();
  await page
    .getByRole("button", { name: "Watch Polymarket for Startups demo" })
    .click();
  await expect(page.locator(".media-modal[open]")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".media-modal[open]")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Watch Polymarket for Startups demo" }),
  ).toBeFocused();
  await page
    .getByRole("button", { name: "press ` to take a shortcut" })
    .click();
  await page
    .getByRole("textbox", { name: "Terminal command" })
    .fill("  WHOAMI  ");
  await page.getByRole("textbox", { name: "Terminal command" }).press("Enter");
  await expect(page.getByRole("log")).toContainText("Waterloo EE");
  await page
    .getByRole("textbox", { name: "Terminal command" })
    .fill("__proto__");
  await page.getByRole("textbox", { name: "Terminal command" }).press("Enter");
  await expect(page.getByRole("log")).toContainText("Unknown trail. Try help.");
  await page.keyboard.press("Escape");
  for (const width of [360, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    const height = await page.evaluate(
      () => document.documentElement.scrollHeight,
    );
    for (let y = 0; y < height; y += 1000) {
      await scroll(page, y);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await scroll(page, 0);
  await page.screenshot({ path: "test-results/mobile-hero.png" });
});

test("reduced motion and live preference changes remove all pinning and transforms", async ({
  page,
}) => {
  await ready(page);
  await expect(page.locator(".pin-spacer")).toHaveCount(1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveClass(/lenis/);
  for (const el of await page.locator(".story-step").all())
    await expect(el).toHaveCSS("opacity", "1");
  await expect(page.locator(".project-card").first()).toHaveCSS(
    "position",
    "relative",
  );
  await scroll(page, 400);
  await expect(page.locator(".hero .landscape-picture")).toHaveCSS(
    "transform",
    "none",
  );
  await page.screenshot({
    path: "test-results/reduced-motion.png",
    fullPage: true,
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator(".pin-spacer")).toHaveCount(1);
  const preview = page.locator(".demo-button video");
  await preview.hover();
  await expect
    .poll(() => preview.evaluate((video: HTMLVideoElement) => video.paused))
    .toBe(false);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect
    .poll(() => preview.evaluate((video: HTMLVideoElement) => video.paused))
    .toBe(true);
  await page.mouse.move(0, 0);
  await preview.hover();
  await expect
    .poll(() => preview.evaluate((video: HTMLVideoElement) => video.paused))
    .toBe(true);
});

test("section links settle after pin initialization, across routes and in history", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await ready(page, "/#work");
  const aligned = async (id: string) => {
    const padding = await page.evaluate(() =>
      parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop),
    );
    await expect
      .poll(
        () =>
          page
            .locator(id)
            .evaluate((el) => Math.round(el.getBoundingClientRect().top)),
        { timeout: 8000 },
      )
      .toBe(padding);
  };
  await aligned("#work");
  const nav = page.getByRole("navigation", {
    name: "Main navigation",
    exact: true,
  });
  await nav.getByRole("link", { name: "About", exact: true }).click();
  await aligned("#about");
  await nav.getByRole("link", { name: "Selected work", exact: true }).click();
  await aligned("#work");
  await page.goBack();
  await aligned("#about");
  await page.goto("/scroll-demo");
  await nav.getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(/\/#about$/);
  await aligned("#about");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#work");
  await aligned("#work");
});

test("routes, metadata, CSP, consent and client navigation cleanup", async ({
  page,
  request,
}) => {
  const response = await page.goto("/");
  expect(response?.headers()["content-security-policy"]).toContain(
    "'strict-dynamic'",
  );
  expect(response?.headers()["content-security-policy"]).not.toContain(
    "unsafe-eval",
  );
  expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
  await expect(page.locator('script[src*="insights"]')).toHaveCount(0);
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
  await page.getByRole("button", { name: "No thanks", exact: true }).click();
  await page.getByRole("link", { name: "Motion study", exact: true }).click();
  await expect(page).toHaveURL(/scroll-demo/);
  await expect(page.locator(".pin-spacer")).toHaveCount(1);
  await page
    .getByRole("link", { name: "Back to the journey", exact: false })
    .click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator(".pin-spacer")).toHaveCount(1);
  for (const path of [
    "/privacy",
    "/terms",
    "/robots.txt",
    "/sitemap.xml",
    "/manifest.webmanifest",
    "/opengraph-image",
    "/favicon.ico",
    "/apple-touch-icon.png",
    "/favicon-32.png",
    "/favicon-16.png",
  ]) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
  }
  const missing = await page.goto("/a-trail-that-does-not-exist");
  expect(missing?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "Off the beaten path." }),
  ).toBeVisible();
});

test("accessibility on home, mobile menu, legal and demo routes", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page);
  for (const path of ["/", "/scroll-demo", "/privacy", "/terms"]) {
    await page.goto(path);
    await page.waitForTimeout(600);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      result.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
      path,
    ).toEqual([]);
  }
  await page.goto("/");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation" }).click();
  const menu = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    menu.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
});

test("keyboard focus exposes an earlier card and failed media has an escape path", async ({
  page,
}) => {
  test.setTimeout(30_000);
  await ready(page);
  await scroll(page, (await top(page, ".card-probability")) + 80);
  const firstDemo = page.getByRole("button", {
    name: "Watch Polymarket for Startups demo",
  });
  await firstDemo.focus();
  const exposed = await firstDemo.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return el.contains(
      document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2),
    );
  });
  expect(exposed).toBe(true);
  await page.route("**/limitless-full.mp4", (route) => route.abort());
  await firstDemo.click();
  await expect(
    page.locator(".media-modal[open]").getByRole("alert"),
  ).toContainText("couldn’t load");
  await page.keyboard.press("Escape");
  await page.route("https://www.loom.com/embed/**", (route) => route.abort());
  await page.getByRole("button", { name: "Watch GP tools demo" }).click();
  await expect(page.getByRole("link", { name: "Watch on Loom" })).toBeVisible();
  const rect = await page.locator(".media-modal[open]").boundingBox();
  expect(rect!.x).toBeGreaterThan(0);
  expect(rect!.y).toBeGreaterThan(0);
  await page.keyboard.press("Escape");
});

test("consent opt-in, withdrawal, and lazy media do not fetch before intent", async ({
  page,
}) => {
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.route("**/_vercel/insights/**", (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: "/* Analytics endpoint stub for local consent QA. */",
    }),
  );
  await page.goto("/");
  await page.getByRole("button", { name: "No thanks", exact: true }).waitFor();
  expect(
    requests.some((url) => /\.mp4|loom.com\/embed|_vercel\/insights/.test(url)),
  ).toBe(false);
  await page.getByRole("button", { name: "Allow analytics" }).click();
  await expect(page.locator('script[src*="insights"]')).toHaveCount(1);
  await page.getByRole("button", { name: "Privacy choices" }).click();
  await page.getByRole("button", { name: "No thanks", exact: true }).click();
  await page.waitForLoadState("load");
  await expect(page.locator('script[src*="insights"]')).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem("roy-analytics"))).toBe(
    "declined",
  );
});

test("content and navigation work without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  for (let visit = 0; visit < 3; visit++) {
    await page.goto(process.env.QA_BASE_URL ?? "http://127.0.0.1:3001");
    await expect(
      page.getByRole("heading", { name: "A little further." }),
    ).toBeVisible();
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    for (const step of await page.locator(".story-step").all())
      await expect(step).toHaveCSS("opacity", "1");
    await expect(page.getByRole("link", { name: "Let’s talk" })).toBeVisible();
  }
  await context.close();
});

test("slow client navigation gives immediate feedback", async ({ page }) => {
  await ready(page);
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/privacy?*", async (route) => {
    await gate;
    await route.continue();
  });
  const click = page
    .getByRole("link", { name: "Privacy", exact: true })
    .click();
  try {
    await expect(page.getByRole("status")).toHaveText("Loading…");
  } finally {
    release();
  }
  await click;
  await expect(page).toHaveURL(/\/privacy$/);
});

test("mobile cross-route loading feedback stays visible after the menu closes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(/\/\?_rsc=/, async (route) => {
    await gate;
    await route.continue();
  });
  await ready(page, "/scroll-demo");
  await page.getByRole("button", { name: "Open navigation" }).click();
  const click = page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "About" })
    .click();
  try {
    await expect(page.locator(".mobile-menu")).not.toBeVisible();
    await expect(page.getByRole("status")).toHaveText("Loading…");
    await expect(page.getByRole("status")).toBeVisible();
  } finally {
    release();
  }
  await click;
  await expect(page).toHaveURL(/\/#about$/);
});

test("supporting pages fit small screens and offer usable link targets", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    for (const path of [
      "/privacy",
      "/terms",
      "/scroll-demo",
      "/missing-trail",
    ]) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${width}: ${path}`,
      ).toBe(true);
      const smallTargets = await page
        .locator("a, button, summary")
        .evaluateAll((elements) =>
          elements
            .filter((el) => {
              const box = el.getBoundingClientRect();
              return (
                box.width > 0 &&
                box.height > 0 &&
                !el.closest("dialog:not([open])") &&
                (box.width < 44 || box.height < 44)
              );
            })
            .map((el) => el.textContent?.trim()),
        );
      expect(smallTargets, `${width}: ${path}`).toEqual([]);
    }
  }
});
