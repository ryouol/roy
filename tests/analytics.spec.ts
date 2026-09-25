import { test, expect, type Page } from "@playwright/test";

// Emulate the hosted script's queue and transport without recording QA visits.
// The installed Next.js Analytics component still loads the script, emits route
// changes under the real production CSP.
async function captureAnalytics(page: Page) {
  const views: string[] = [];
  await page.route("**/_vercel/insights/view", async (route) => {
    views.push(new URL(route.request().postDataJSON().url).pathname);
    await route.fulfill({ status: 204 });
  });
  await page.route(
    /\/_vercel\/insights\/script\.js|https:\/\/va\.vercel-scripts\.com\//,
    (route) =>
      route.fulfill({
        contentType: "application/javascript",
        body: `
          let beforeSend = event => event;
          window.va = (type, data) => {
            if (type === "beforeSend") beforeSend = data;
            if (type === "pageview") {
              const event = beforeSend({ type: "pageview", url: new URL(data.path, location.origin).href });
              if (event) fetch("/_vercel/insights/view", {
                method: "POST", body: JSON.stringify(event)
              });
            }
          };
          for (const args of window.vaq || []) window.va(...args);
          window.vaq = [];
        `,
      }),
  );
  return views;
}

test("the removed privacy page returns 404 and client navigation tracks page views", async ({
  page,
}) => {
  const views = await captureAnalytics(page);
  const response = await page.goto("/privacy");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "Page not found" }),
  ).toBeVisible();
  await expect.poll(() => views).toEqual(["/privacy"]);
  await page
    .getByRole("link", { name: "Back to portfolio", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Roy Luo", exact: true }),
  ).toBeVisible();
  await expect.poll(() => views).toEqual(["/privacy", "/"]);
  await expect(
    page.getByRole("link", { name: "Privacy", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.locator(".consent, .privacy-preferences, .privacy-settings"),
  ).toHaveCount(0);
});

for (const preference of [null, "declined"] as const) {
  test(`analytics tracks a visit with ${preference ? "an old declined preference" : "no saved preference"}`, async ({
    page,
  }) => {
    const views = await captureAnalytics(page);
    if (preference) {
      await page.addInitScript(
        (value) => localStorage.setItem("roy-analytics", value),
        preference,
      );
    }
    await page.goto("/");
    await expect.poll(() => views).toEqual(["/"]);
    await expect(
      page.locator('script[data-sdkn^="@vercel/analytics"]'),
    ).toHaveCount(1);
  });
}

test("analytics does not depend on browser storage", async ({ page }) => {
  const views = await captureAnalytics(page);
  await page.addInitScript(() => {
    for (const method of ["getItem", "setItem", "removeItem"] as const) {
      Storage.prototype[method] = () => {
        throw new DOMException("Storage blocked", "SecurityError");
      };
    }
  });
  await page.goto("/");
  await expect.poll(() => views).toEqual(["/"]);
});
