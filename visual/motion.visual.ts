import { expect, openStory, test } from './fixtures';

// Bob's animations run only under motion-safe. The config sets reducedMotion: 'reduce' for every
// test; this file checks both settings on the live dots and the toast.
const CASES = [
  ['board-ticketcard--states', '.ticket-card-live', 'live-pulse'],
  ['core-statusdot--default', '.status-dot-live', 'live-pulse'],
  ['feedback-toast--default', '.toast', 'toast-in'],
] as const;

for (const [story, selector, keyframe] of CASES) {
  test(`${story}: ${selector} runs ${keyframe} only when the user allows motion`, async ({ page }) => {
    await openStory(page, story);
    const el = page.locator(selector).first();
    await expect(el).toHaveCSS('animation-name', 'none');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await expect(el).toHaveCSS('animation-name', keyframe);
  });
}
