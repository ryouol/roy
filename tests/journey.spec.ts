import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const analyticsRoute =
  /\/_vercel\/insights\/|https:\/\/va\.vercel-scripts\.com\//;
const analyticsScripts =
  'script[src*="/_vercel/insights/"], script[src*="va.vercel-scripts.com/"]';

async function ready(page: Page, path = "/") {
  await page.goto(path);
  await page.evaluate(() => document.fonts.ready);
}

for (const viewport of [
  { width: 1448, height: 1086 },
  { width: 1280, height: 720 },
  { width: 820, height: 1180 },
  { width: 390, height: 844 },
  { width: 320, height: 740 },
]) {
  test(`content and anchor navigation at ${viewport.width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await ready(page);
    await expect(
      page.getByRole("heading", { name: "Roy Luo", exact: true }),
    ).toBeVisible();
    await expect(page.locator(".term")).toHaveCount(6);
    await expect(page.locator(".term h3")).toHaveText([
      "Squint",
      "Aditum Bio",
      "Squint",
      "Tesla",
      "Tesla",
      "AES",
    ]);
    await expect(page.locator(".term").nth(1)).toContainText("Cambridge, MA");
    await expect(page.locator(".scene-webgl")).toHaveAttribute(
      "data-ready",
      "true",
      { timeout: 30_000 },
    );
    await expect(page.locator(".hero-education")).toContainText("UWaterloo");
    await expect(
      page.locator("header, .hero-next, .privacy-settings, .consent"),
    ).toHaveCount(0);
    const pins = await page.locator(".peak-label").evaluateAll((labels) =>
      labels.map((label) => {
        const rect = label.getBoundingClientRect();
        return {
          left: rect.left,
          right: rect.right,
          top: rect.top,
          bottom: rect.bottom,
        };
      }),
    );
    for (const pin of pins) {
      expect(pin.left).toBeGreaterThanOrEqual(0);
      expect(pin.right).toBeLessThanOrEqual(viewport.width);
      expect(pin.top).toBeGreaterThanOrEqual(0);
      expect(pin.bottom).toBeLessThanOrEqual(viewport.height);
    }
    for (const [name, id] of [
      ["Experience", "experience"],
      ["Projects", "work"],
      ["Contact", "contact"],
    ]) {
      if (name !== "Experience") {
        await page
          .getByRole("link", { name: "Back to top", exact: true })
          .click();
        await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(1);
      }
      await page
        .getByRole("navigation", { name: "Explore the mountains" })
        .getByRole("link", { name, exact: true })
        .click();
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await expect
        .poll(() =>
          page.locator(`#${id}`).evaluate((el) => {
            const top = el.getBoundingClientRect().top;
            const padding = parseFloat(
              getComputedStyle(document.documentElement).scrollPaddingTop,
            );
            // The last section can meet the end of the document first.
            const expected = Math.max(
              padding,
              innerHeight -
                document.documentElement.scrollHeight +
                top +
                scrollY,
            );
            return Math.abs(top - expected);
          }),
        )
        .toBeLessThan(2);
      if (id === "work") {
        await expect(page.locator(".project-row")).toHaveCount(6);
        expect(
          await page
            .locator("#work")
            .evaluate((el) => el.getBoundingClientRect().height),
        ).toBeLessThan(2300);
        await expect(page.locator(".repository-card")).toHaveCount(3);
        const podTops = await page
          .locator(".repository-card")
          .evaluateAll((cards) =>
            cards.map((card) => card.getBoundingClientRect().top),
          );
        expect(Math.max(...podTops) - Math.min(...podTops)).toBeLessThan(1);
        await page.screenshot({ path: testInfo.outputPath("projects.png") });
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    await expect(
      page.getByRole("link", { name: "r55luo@uwaterloo.ca" }),
    ).toHaveAttribute("href", "mailto:r55luo@uwaterloo.ca");
    expect(errors).toEqual([]);
  });
}

test("project previews use the correct demos and direct product links", async ({
  page,
}) => {
  await ready(page);
  await expect(page.locator(".project-row h3")).toHaveText([
    "Rushes",
    "Unrender",
    "Way Line",
    "Startup prediction market",
    "Loupe",
    "VC Fund OS",
  ]);
  await expect(page.locator(".repository-card h3")).toHaveText([
    "TickForge",
    "Weighted log distributor",
    "gRPC on NVIDIA Xavier",
  ]);
  await expect(
    page.getByRole("link", { name: "Weighted log distributor on GitHub" }),
  ).toHaveAttribute("href", "https://github.com/ryouol/wla-distibutor");
  await expect(
    page.getByRole("link", { name: "gRPC on NVIDIA Xavier on GitHub" }),
  ).toHaveAttribute("href", "https://github.com/ryouol/gRPCNvidia-Work");
  await expect(page.locator("iframe, video")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Watch VC Fund OS demo", exact: true }),
  ).toHaveAttribute(
    "href",
    "https://www.loom.com/share/0ebacafae02c436b8324024a3a44bebc",
  );
  await expect(
    page.getByRole("link", { name: "VC Fund OS LP portal demo", exact: true }),
  ).toHaveAttribute(
    "href",
    "https://www.loom.com/share/de3de4a9c1b4418a87f01c9119b38025",
  );
  await expect(
    page.getByRole("link", {
      name: "Watch Startup prediction market demo",
      exact: true,
    }),
  ).toHaveAttribute("href", "/limitless-full.mp4");
  await expect(
    page.getByRole("article", { name: "Loupe", exact: true }).locator("img"),
  ).toHaveAttribute("alt", /inference phases, memory/);

  for (const [name, id] of [
    ["Rushes", "9dYaSqmr"],
    ["Unrender", "4lFdVojh"],
  ]) {
    const preview = page.getByRole("link", {
      name: `Watch ${name} demo`,
      exact: true,
    });
    await expect(preview).toHaveAttribute(
      "href",
      `https://screen.studio/share/${id}`,
    );
    await expect(preview).toHaveAttribute("target", "_blank");
    await expect(preview.locator("img")).toHaveAttribute("loading", "lazy");
  }
  for (const [name, url] of [
    ["Rushes", "https://rushes.onrender.com/"],
    ["Unrender", "https://unrender.onrender.com/"],
    ["Way Line", "https://wayline-9ten.onrender.com/"],
  ]) {
    await expect(
      page.getByRole("link", { name: `Try ${name}`, exact: true }),
    ).toHaveAttribute("href", url);
  }
  await expect(
    page.getByRole("link", { name: "TickForge on GitHub" }),
  ).toHaveAttribute("href", "https://github.com/ryouol/tickforge");
  await expect(
    page.getByRole("link", { name: "Loupe on GitHub" }),
  ).toHaveAttribute("href", "https://github.com/ryouol/Loupe");
});

test("reduced motion keeps the static landscape and all content", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page);
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Pause motion" })).toHaveCount(
    0,
  );
  await expect(page.locator(".scene-poster")).toHaveCSS(
    "background-image",
    /alpine-poster/,
  );
  await expect(page.locator(".term")).toHaveCount(6);
  await expect(
    page.getByRole("link", { name: "Watch Rushes demo" }),
  ).toHaveAttribute("href", "https://screen.studio/share/9dYaSqmr");
  await expect(page.locator("html")).not.toHaveClass(/lenis/);
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(scan.violations).toEqual([]);
});

test("scene pauses while content navigation continues", async ({ page }) => {
  await ready(page);
  await expect(page.locator(".scene-webgl")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await expect(page.locator(".scene-webgl")).toHaveAttribute(
    "data-flight-progress",
    /^0\./,
  );
  await page.getByRole("button", { name: "Pause motion" }).click();
  const resume = page.getByRole("button", { name: "Resume motion" });
  await expect(resume).toHaveAttribute("aria-pressed", "true");
  const start = await page
    .locator(".scene-webgl")
    .getAttribute("data-flight-progress");
  await page
    .getByRole("navigation", { name: "Explore the mountains" })
    .getByRole("link", { name: "Projects", exact: true })
    .click();
  await expect(page).toHaveURL(/#work$/);
  await expect(resume).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".scene-webgl")).toHaveAttribute(
    "data-flight-progress",
    start!,
  );
  await resume.click();
  await expect(
    page.getByRole("button", { name: "Pause motion" }),
  ).toHaveAttribute("aria-pressed", "false");
  await expect
    .poll(async () =>
      Number(
        await page.locator(".scene-webgl").getAttribute("data-flight-progress"),
      ),
    )
    .toBeGreaterThan(0.5);

  // Pausing away from the opening peaks must not hide the hero destinations.
  await page.getByRole("button", { name: "Pause motion" }).click();
  const frozen = await page
    .locator(".scene-webgl")
    .getAttribute("data-flight-progress");
  await page.getByRole("link", { name: "Back to top", exact: true }).click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(1);
  const peaks = page.getByRole("navigation", { name: "Explore the mountains" });
  for (const name of ["Experience", "Projects", "Contact"]) {
    await expect(peaks.getByRole("link", { name, exact: true })).toBeVisible();
  }
  await peaks.getByRole("link", { name: "Experience", exact: true }).click();
  await expect(page).toHaveURL(/#experience$/);
  await expect(page.locator(".scene-webgl")).toHaveAttribute(
    "data-flight-progress",
    frozen!,
  );
});

test("all experience and destinations are available without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Roy Luo", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".term")).toHaveCount(6);
  await expect(
    page.getByRole("link", { name: "Aditum Bio", exact: true }),
  ).toHaveAttribute("href", "https://www.aditumbio.com/");
  await expect(page.locator(".scene-poster")).toHaveCSS(
    "background-image",
    /alpine-poster/,
  );
  await context.close();
});

test("security headers and public assets remain available", async ({
  request,
}) => {
  const response = await request.get("/");
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-security-policy"]).toContain("nonce-");
  expect(await response.text()).toContain(
    'href="https://screen.studio/share/9dYaSqmr"',
  );
  expect((await request.get("/terms")).status()).toBe(404);
  for (const path of [
    "/projects/rushes.webp",
    "/projects/unrender.webp",
    "/projects/wayline.webp",
    "/projects/loupe.webp",
    "/projects/fund-os.webp",
    "/projects/startup-market.webp",
    "/scenery/cloud-descent.webp",
    "/scenery/cloud-bank.webp",
    "/scenery/swiss-alps.bin",
    "/scenery/swiss-alps.json",
    "/scenery/swiss-alps-albedo.webp",
    "/scenery/swiss-alps-normal.webp",
    "/scenery/alpine-poster.webp",
    "/scenery/alpine-poster-mobile.webp",
    "/scenery/alpine-rock.webp",
    "/manifest.webmanifest",
    "/robots.txt",
  ]) {
    expect((await request.get(path)).ok()).toBe(true);
  }
});

test("analytics preferences live on Privacy and remain off until selected", async ({
  page,
}) => {
  let analyticsRequests = 0;
  await page.route(analyticsRoute, (route) => {
    analyticsRequests++;
    return route.fulfill({
      status: 200,
      contentType: "application/javascript",
      body: "",
    });
  });
  await ready(page);
  await expect(page.locator(".consent, .privacy-settings")).toHaveCount(0);
  expect(analyticsRequests).toBe(0);
  await page.getByRole("link", { name: "Privacy", exact: true }).click();
  await expect(page).toHaveURL(/\/privacy$/);
  await expect(page.getByRole("status")).toHaveText("Analytics are Off.");
  await page.getByRole("button", { name: "Turn on", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Analytics are On.");
  await expect.poll(() => analyticsRequests).toBeGreaterThan(0);
  await page.getByRole("button", { name: "Turn off", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Analytics are Off.");
  await expect(page.locator(analyticsScripts)).toHaveCount(0);
});

test("analytics can be disabled when preference storage is blocked", async ({
  page,
}) => {
  await page.route(analyticsRoute, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/javascript",
      body: "",
    }),
  );
  await page.addInitScript(() => {
    localStorage.setItem("roy-analytics", "accepted");
    Storage.prototype.setItem = () => {
      throw new DOMException("Storage blocked", "SecurityError");
    };
    Storage.prototype.removeItem = () => {
      throw new DOMException("Storage blocked", "SecurityError");
    };
  });
  await ready(page, "/privacy");
  await expect(page.getByRole("status")).toHaveText("Analytics are On.");
  let reloads = 0;
  page.on("framenavigated", (frame) => {
    if (frame === page.mainFrame()) reloads++;
  });
  await page.getByRole("button", { name: "Turn off", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Analytics are Off.");
  expect(reloads).toBe(0);
  await page
    .getByRole("link", { name: "Back to portfolio", exact: true })
    .click();
  await expect(page.locator(".consent, .privacy-settings")).toHaveCount(0);
});

for (const viewport of [
  { width: 1448, height: 1086 },
  { width: 390, height: 844 },
]) {
  test(`compact experience reveals details horizontally at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await ready(page, "/#experience");
    await expect(page.locator(".scene-webgl")).toHaveAttribute(
      "data-ready",
      "true",
      { timeout: 30_000 },
    );
    const first = page.locator(".term").first();
    const rail = first.locator(".term-track");
    const distance = await page.evaluate(
      () =>
        document.getElementById("work")!.offsetTop -
        document.getElementById("experience")!.offsetTop,
    );
    expect(distance).toBeLessThan(1250);
    await expect(first.locator(".term-overview")).toBeInViewport();
    await expect(first.locator(".term-details")).not.toBeInViewport();
    const startY = await page.evaluate(() => scrollY);
    const show = first.getByRole("button", {
      name: "Details for Squint, May — Aug 2026",
      exact: true,
    });
    await show.click();
    await expect
      .poll(() =>
        rail.evaluate((el) => Math.abs(el.scrollLeft - el.clientWidth)),
      )
      .toBeLessThan(2);
    await expect(first.locator(".term-details")).toBeFocused();
    await expect(first.locator(".term-details")).toContainText("8+ hours");
    expect(
      Math.abs((await page.evaluate(() => scrollY)) - startY),
    ).toBeLessThan(2);
    expect(
      await page
        .locator(".term-track")
        .nth(1)
        .evaluate((el) => el.scrollLeft),
    ).toBe(0);

    await first
      .getByRole("button", {
        name: "Back to Squint, May — Aug 2026",
        exact: true,
      })
      .click();
    await expect
      .poll(() => rail.evaluate((el) => el.scrollLeft))
      .toBeLessThan(2);
    await rail.focus();
    await page.keyboard.press("ArrowRight");
    await expect
      .poll(() =>
        rail.evaluate((el) => Math.abs(el.scrollLeft - el.clientWidth)),
      )
      .toBeLessThan(2);
    await page.keyboard.press("ArrowLeft");
    await expect
      .poll(() => rail.evaluate((el) => el.scrollLeft))
      .toBeLessThan(2);

    await rail.hover();
    await page.mouse.wheel(700, 0);
    await expect
      .poll(() => rail.evaluate((el) => el.scrollLeft))
      .toBeGreaterThan(100);
    expect(
      Math.abs((await page.evaluate(() => scrollY)) - startY),
    ).toBeLessThan(2);
    await page.mouse.wheel(0, 350);
    await expect
      .poll(() => page.evaluate(() => scrollY))
      .toBeGreaterThan(startY + 100);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}
