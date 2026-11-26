import { expect, openStory, test } from './fixtures';

// Keyboard behaviour in a real browser (PLAN-005 TASK-032). What Bob does today passes. A gap is
// a test marked test.fail(): it documents what is missing and fails as soon as the gap is closed,
// so whoever closes it turns it into a normal test. The gaps wait for the decision on headless
// primitives (Radix, Base UI or React Aria); Bob does not hand-write a focus trap or a roving
// tabindex.

test.describe('Modal', () => {
  test.beforeEach(async ({ page }) => {
    await openStory(page, 'states-board--modal-keyboard');
    await page.getByRole('button', { name: 'Open' }).click();
  });

  test('is a modal dialog named by its title, with a named close button', async ({ page }) => {
    const dialog = page.getByRole('dialog', { name: 'Archive SB-042?' });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await expect(dialog.getByRole('button', { name: 'Close' })).toBeVisible();
  });

  test('gap: Escape does not close it', async ({ page }) => {
    test.fail();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0, { timeout: 1000 });
  });

  test('gap: focus does not move into it when it opens', async ({ page }) => {
    test.fail();
    await expect(page.getByRole('dialog').locator(':focus')).toHaveCount(1, { timeout: 1000 });
  });

  test('gap: Tab leaves it (no focus trap)', async ({ page }) => {
    test.fail();
    await page.getByRole('dialog').getByRole('button', { name: 'Archive' }).focus();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('dialog').locator(':focus')).toHaveCount(1, { timeout: 1000 });
  });

  test('gap: focus does not return to the trigger when it closes', async ({ page }) => {
    test.fail();
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('button', { name: 'Open' })).toBeFocused({ timeout: 1000 });
  });
});

test.describe('Select', () => {
  test('Tab focuses it, arrow keys and typeahead change the value (the native select)', async ({ page }) => {
    await openStory(page, 'forms-select--default');
    const select = page.getByRole('combobox', { name: 'Stage' });
    await page.keyboard.press('Tab');
    await expect(select).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(select).toHaveValue('exploring');
    await page.keyboard.type('d');
    await expect(select).toHaveValue('done');
  });
});

test.describe('SegToggle', () => {
  test('each option is a button in the Tab order; Enter and Space press it; aria-pressed marks the active one', async ({ page }) => {
    await openStory(page, 'core-segtoggle--default');
    await page.keyboard.press('Tab');
    const day = page.getByRole('button', { name: 'day' });
    await expect(day).toBeFocused();
    await expect(day).toHaveAttribute('aria-pressed', 'false');
    await expect(page.getByRole('button', { name: 'week' })).toHaveAttribute('aria-pressed', 'true');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'week' })).toBeFocused();
  });

  test('gap: arrow keys do not move between the options (no radio group, no roving tabindex)', async ({ page }) => {
    test.fail();
    await openStory(page, 'core-segtoggle--default');
    await page.keyboard.press('Tab');
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('button', { name: 'week' })).toBeFocused({ timeout: 1000 });
  });
});

test.describe('Toast', () => {
  test('a toast is a status, an error toast an alert', async ({ page }) => {
    await openStory(page, 'feedback-toast--default');
    await expect(page.getByRole('status')).toHaveText('Saved.');
    await expect(page.getByRole('alert')).toHaveText(/Could not save/);
  });
});

test.describe('ListRow and TicketCard with onClick', () => {
  for (const [story, name] of [
    ['states-board--rows', /SB-042/],
    ['states-board--cards', /SB-042/],
  ] as const) {
    test(`${story}: Tab reaches it, Enter and Space click it`, async ({ page }) => {
      await openStory(page, story);
      const clicks = () => page.evaluate(() => (window as unknown as { bobClicks?: number }).bobClicks ?? 0);
      const first = page.getByRole('button', { name }).first();
      await page.keyboard.press('Tab');
      await expect(first).toBeFocused();
      await expect(first).toHaveCSS('outline-style', 'solid');
      await page.keyboard.press('Enter');
      expect(await clicks()).toBe(1);
      await page.keyboard.press(' ');
      expect(await clicks()).toBe(2);
    });
  }
});

test.describe('focus ring', () => {
  for (const story of ['core-button--default', 'core-segtoggle--default', 'forms-input--default', 'forms-searchinput--default', 'board-navrow--default']) {
    test(`${story}: the first Tab stop shows the 2px accent ring`, async ({ page }) => {
      await openStory(page, story);
      await page.keyboard.press('Tab');
      const el = page.locator(':focus');
      await expect(el).toHaveCSS('outline-style', 'solid');
      await expect(el).toHaveCSS('outline-width', '2px');
      await expect(el).toHaveCSS('outline-color', 'rgb(123, 131, 235)');
    });
  }
});
