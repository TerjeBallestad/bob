import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

// One screenshot per story in the built Storybook. A story added later gets a
// test with no baseline, which fails until someone runs with --update-snapshots.
type Entry = { id: string; type: string };
const index = JSON.parse(readFileSync('storybook-static/index.json', 'utf8')) as { entries: Record<string, Entry> };
const stories = Object.values(index.entries).filter((e) => e.type === 'story');

test('the Storybook has a story for each of the 19 components', () => {
  expect(stories.length).toBeGreaterThanOrEqual(19);
});

for (const { id } of stories) {
  test(id, async ({ page }) => {
    await page.goto(`/iframe.html?id=${id}&viewMode=story`);
    await page.locator('#storybook-root > *').first().waitFor();
    // fonts.ready alone resolves before a font the page has not asked for yet,
    // such as an input's placeholder. Load every family and weight first.
    await page.evaluate(() =>
      Promise.all([
        ...[400, 500, 600, 700].map((w) => document.fonts.load(`${w} 13px "Schibsted Grotesk"`)),
        ...[400, 500, 600].map((w) => document.fonts.load(`${w} 13px "JetBrains Mono"`)),
      ]).then(() => document.fonts.ready),
    );
    await expect(page).toHaveScreenshot(`${id}.png`);
  });
}
