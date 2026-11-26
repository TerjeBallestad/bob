import { expect, openStory, stories, test } from './fixtures';

// One screenshot per story in the built Storybook. A story added later gets a
// test with no baseline, which fails until someone runs with --update-snapshots.

test('the Storybook has a story for each of the 19 components', () => {
  expect(stories.length).toBeGreaterThanOrEqual(19);
});

for (const { id } of stories) {
  test(id, async ({ page }) => {
    // Waits for the play function too, so a story with one is shot in its final state.
    await openStory(page, id);
    await expect(page).toHaveScreenshot(`${id}.png`);
  });
}
