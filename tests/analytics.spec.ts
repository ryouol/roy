import { test, expect, type Page } from "@playwright/test";

// Emulate the hosted script's queue and transport without recording QA visits.
// The installed Next.js Analytics component still loads the script, emits route
// changes, and supplies beforeSend under the real production CSP.
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

async function expectPreference(page: Page, enabled: boolean) {
  await expect(page.getByRole("status")).toHaveText(
    `Analytics are ${enabled ? "On" : "Off"}.`,
  );
}

test("new visits and client-side navigation send page views by default", async ({
  page,
}) => {
  const views = await captureAnalytics(page);
  await page.goto("/");
  await expect.poll(() => views).toEqual(["/"]);
  await expect(page.locator(".consent, .privacy-settings")).toHaveCount(0);
  await page.getByRole("link", { name: "Privacy", exact: true }).click();
  await expectPreference(page, true);
  await expect.poll(() => views).toEqual(["/", "/privacy"]);
});

test("a saved opt-out prevents the tracking script from loading", async ({
  page,
}) => {
  const views = await captureAnalytics(page);
  await page.addInitScript(() =>
    localStorage.setItem("roy-analytics", "declined"),
  );
  await page.goto("/privacy");
  await expectPreference(page, false);
  await expect(
    page.locator('script[data-sdkn^="@vercel/analytics"]'),
  ).toHaveCount(0);
  expect(views).toEqual([]);
});

test("visitors can turn default analytics off, reload, and turn it back on", async ({
  page,
}) => {
  const views = await captureAnalytics(page);
  await page.goto("/privacy");
  await expect.poll(() => views).toEqual(["/privacy"]);
  await page.getByRole("button", { name: "Turn off", exact: true }).click();
  await expectPreference(page, false);
  await expect(
    page.locator('script[data-sdkn^="@vercel/analytics"]'),
  ).toHaveCount(0);
  await page.reload();
  await expectPreference(page, false);
  expect(views).toEqual(["/privacy"]);
  await page.getByRole("button", { name: "Turn on", exact: true }).click();
  await expectPreference(page, true);
  await expect.poll(() => views).toEqual(["/privacy", "/privacy"]);
});

for (const storageFailure of ["unavailable", "full"] as const) {
  test(`opt-out blocks later page views when storage is ${storageFailure}`, async ({
    page,
  }) => {
    const views = await captureAnalytics(page);
    await page.addInitScript((failure) => {
      localStorage.setItem("roy-analytics", "accepted");
      Storage.prototype.setItem = () => {
        throw new DOMException("Storage unavailable", "QuotaExceededError");
      };
      if (failure === "unavailable") {
        Storage.prototype.getItem = () => {
          throw new DOMException("Storage blocked", "SecurityError");
        };
        Storage.prototype.removeItem = () => {
          throw new DOMException("Storage blocked", "SecurityError");
        };
      }
    }, storageFailure);
    await page.goto("/privacy");
    await expect.poll(() => views).toEqual(["/privacy"]);
    await page.getByRole("button", { name: "Turn off", exact: true }).click();
    await expectPreference(page, false);
    await page
      .getByRole("link", { name: "Back to portfolio", exact: true })
      .click();
    await page.getByRole("link", { name: "Privacy", exact: true }).click();
    await expectPreference(page, false);
    expect(views).toEqual(["/privacy"]);
  });
}

test("an opt-out in another tab stops an already loaded tracker", async ({
  page,
  context,
}) => {
  const views = await captureAnalytics(page);
  await page.goto("/privacy");
  await expect.poll(() => views).toEqual(["/privacy"]);
  const otherTab = await context.newPage();
  await captureAnalytics(otherTab);
  await otherTab.goto("/privacy");
  await expectPreference(otherTab, true);
  await otherTab.getByRole("button", { name: "Turn off", exact: true }).click();
  await expectPreference(page, false);
  await page
    .getByRole("link", { name: "Back to portfolio", exact: true })
    .click();
  await page.getByRole("link", { name: "Privacy", exact: true }).click();
  await expectPreference(page, false);
  expect(views).toEqual(["/privacy"]);
});
