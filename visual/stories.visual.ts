import { expect, test } from '@playwright/test';
import { openStory, stories } from './story';

// One screenshot per story in the built Storybook. A story added later gets a
// test with no baseline, which fails until someone runs with --update-snapshots.

test('the Storybook has a story for each of the 19 components', () => {
  expect(stories.length).toBeGreaterThanOrEqual(19);
});

for (const { id } of stories) {
  test(id, async ({ page }) => {
    // Waits for the play function too, so a story with one is shot in its final state.
    await openStory(page, id);
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
