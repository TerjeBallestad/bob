import { expect, test } from '@playwright/test';
import { openStory, stories } from './story';

// The interaction tests: every story with a play function, run in the built Storybook.
// Storybook tags those stories play-fn. A play function that throws, or an expect in it
// that fails, makes Storybook finish the story with status "error".
const played = stories.filter((s) => s.tags?.includes('play-fn'));

test('Modal, Select, SegToggle and Toast each have an interaction test', () => {
  expect(played.map((s) => s.id).sort()).toEqual(
    expect.arrayContaining([
      'core-segtoggle--switch-segments',
      'feedback-modal--open-and-close',
      'feedback-toast--show-toasts',
      'forms-select--choose-an-option',
    ]),
  );
});

for (const { id } of played) {
  test(`${id} plays`, async ({ page }) => {
    const result = await openStory(page, id);
    expect(result.errors).toEqual([]);
    expect(result.status).toBe('success');
  });
}
