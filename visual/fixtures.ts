import { test as base, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { openStory as openStoryOnly } from './story';

// Bob loads its webfonts from Google Fonts (src/tokens/fonts.css). Google's CDN serves two builds
// of the same stylesheet: one points at .woff2 files, the other at kit URLs (?skey=...) with
// other font files. Their average character widths differ, so an input or textarea with no
// width of its own (its size or cols times that width) is 203 or 172 px wide. About 1 run in 17
// got the second build, and forms--input-story (169 px) and forms--textarea-story (85 px)
// failed at random. The tests serve one fixed copy of the stylesheet and its files instead
// (visual/fonts/, the build the baselines were taken with), so no test reads the network.
const FONTS = join(import.meta.dirname, 'fonts');

export const test = base.extend<{ fonts: void }>({
  fonts: [
    async ({ page }, use) => {
      await page.route('https://fonts.googleapis.com/**', (route) =>
        route.fulfill({
          contentType: 'text/css',
          body: readFileSync(join(FONTS, 'google-fonts.css'), 'utf8'),
        }),
      );
      await page.route('https://fonts.gstatic.com/**', (route) =>
        route.fulfill({
          contentType: 'font/woff2',
          body: readFileSync(join(FONTS, basename(new URL(route.request().url()).pathname))),
        }),
      );
      await use();
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
export { stories } from './story';

// Open a story (visual/story.ts: rendered, and its play function run), then wait until every
// webfont family and weight Bob uses has loaded. fonts.ready alone resolves before a font the
// page has not asked for yet, such as an input's placeholder.
export async function openStory(page: Page, id: string) {
  const finished = await openStoryOnly(page, id);
  await page.locator('#storybook-root > *').first().waitFor();
  await page.evaluate(() =>
    Promise.all([
      ...[400, 500, 600, 700].map((w) => document.fonts.load(`${w} 13px "Schibsted Grotesk"`)),
      ...[400, 500, 600].map((w) => document.fonts.load(`${w} 13px "JetBrains Mono"`)),
    ]).then(() => document.fonts.ready),
  );
  return finished;
}
