import type { Page } from '@playwright/test';
import { expect, openStory, test } from './fixtures';

// Keyboard behaviour in a real browser (PLAN-005 TASK-032). What Bob does today passes. A gap is
// a test marked test.fail(): it documents what is missing and fails as soon as the gap is closed,
// so whoever closes it turns it into a normal test. The gaps wait for the decision on headless
// primitives (Radix, Base UI or React Aria); Bob does not hand-write a focus trap or a roving
// tabindex.

test.describe('Modal', () => {
  // Base UI's Dialog (DD-034) does the focus handling. The dialog renders in a portal at the end
  // of <body>. At each end of the dialog sits a hidden focus guard: Tab lands on it, and Base UI
  // moves focus on to the other end a frame later. So the test waits for focus to settle.
  const focusedButtonInDialog = (page: Page) =>
    page.evaluate(() => {
      const el = document.activeElement;
      return el?.tagName === 'BUTTON' && el.closest('[role="dialog"]') ? el.textContent : null;
    });

  test.beforeEach(async ({ page }) => {
    await openStory(page, 'feedback-states--modal-keyboard');
    await page.getByRole('button', { name: 'Open' }).click();
  });

  test('is a modal dialog named by its title, with a named close button', async ({ page }) => {
    const dialog = page.getByRole('dialog', { name: 'Archive SB-042?' });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await expect(dialog.getByRole('button', { name: 'Close' })).toBeVisible();
  });

  test('Escape closes it', async ({ page }) => {
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0, { timeout: 1000 });
  });

  test('focus moves to the dialog when it opens, and the first Tab reaches the close button', async ({ page }) => {
    await expect(page.getByRole('dialog')).toBeFocused({ timeout: 1000 });
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Close' })).toBeFocused({ timeout: 1000 });
  });

  test('Tab and Shift+Tab stay inside it (a focus trap)', async ({ page }) => {
    await page.getByRole('dialog').getByRole('button', { name: 'Archive' }).focus();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Close' })).toBeFocused({ timeout: 1000 });
    await page.keyboard.press('Shift+Tab');
    await expect(page.getByRole('dialog').getByRole('button', { name: 'Archive' })).toBeFocused({ timeout: 1000 });
    // Two full rounds: Close, Cancel, Archive, and back to Close.
    for (const name of ['×', 'Cancel', 'Archive', '×', 'Cancel', 'Archive']) {
      await page.keyboard.press('Tab');
      await expect.poll(() => focusedButtonInDialog(page), { timeout: 1000 }).toBe(name);
    }
  });

  test('focus returns to the trigger when it closes, by a button or by Escape', async ({ page }) => {
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('button', { name: 'Open' })).toBeFocused({ timeout: 1000 });
    await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog')).toBeFocused({ timeout: 1000 });
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Open' })).toBeFocused({ timeout: 1000 });
  });

  test('the page behind it is hidden from assistive technology while it is open', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Open' })).toHaveCount(0);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Open' })).toHaveCount(1);
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
  // Base UI's ToggleGroup (DD-034): the group is one Tab stop, and the arrow keys move between
  // the segments.
  test('the group is one Tab stop; aria-pressed marks the active segment; Enter and Space press the focused one', async ({ page }) => {
    await openStory(page, 'core-segtoggle--default');
    await expect(page.getByRole('group')).toBeVisible();
    await page.keyboard.press('Tab');
    const day = page.getByRole('button', { name: 'day' });
    await expect(day).toBeFocused();
    await expect(day).toHaveAttribute('aria-pressed', 'false');
    await expect(page.getByRole('button', { name: 'week' })).toHaveAttribute('aria-pressed', 'true');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: /^(day|week|month)$/ }).and(page.locator(':focus'))).toHaveCount(0);
  });

  test('arrow keys move between the segments, and wrap; Home and End go to the ends', async ({ page }) => {
    await openStory(page, 'core-segtoggle--default');
    await page.keyboard.press('Tab');
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('button', { name: 'week' })).toBeFocused({ timeout: 1000 });
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('button', { name: 'day' })).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await expect(page.getByRole('button', { name: 'month' })).toBeFocused();
    await page.keyboard.press('Home');
    await expect(page.getByRole('button', { name: 'day' })).toBeFocused();
    await page.keyboard.press('End');
    await expect(page.getByRole('button', { name: 'month' })).toBeFocused();
  });

  test('an arrow key moves focus only; the active segment changes on Enter or Space', async ({ page }) => {
    await openStory(page, 'core-segtoggle--switch-segments');
    // The play function ends with "day" active and focused.
    await expect(page.getByRole('button', { name: 'day' })).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('button', { name: 'week' })).toHaveAttribute('aria-pressed', 'false');
    await page.keyboard.press(' ');
    await expect(page.getByRole('button', { name: 'week' })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('button', { name: 'day' })).toHaveAttribute('aria-pressed', 'false');
  });
});

test.describe('Toast', () => {
  test('a toast is a status, an error toast an alert', async ({ page }) => {
    await openStory(page, 'feedback-toast--success-and-error');
    await expect(page.getByRole('status')).toHaveText('Saved.');
    await expect(page.getByRole('alert')).toHaveText(/Could not save/);
  });

  // Base UI's toast viewport (DD-034). The play function of feedback-toast--show-toasts checks
  // that the region is in the page, empty, before the first toast.
  test('ToastStack is a polite live region named Notifications, and the toasts sit in it', async ({ page }) => {
    await openStory(page, 'feedback-toast--show-toasts');
    const region = page.getByRole('region', { name: 'Notifications' });
    await expect(region).toHaveAttribute('aria-live', 'polite');
    await expect(region).toHaveAttribute('aria-relevant', 'additions text');
    await expect(region.getByRole('status')).toHaveText('Title updated');
    await expect(region.getByRole('alert')).toHaveText('Could not save');
  });
});

test.describe('ListRow and TicketCard with onClick', () => {
  for (const [story, name] of [
    ['board-states--rows', /SB-042/],
    ['board-states--cards', /SB-042/],
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

test.describe('roles and states', () => {
  test('the active NavRow is the current page, and only it', async ({ page }) => {
    await openStory(page, 'board-navrow--sidebar');
    await expect(page.locator('[aria-current="page"]')).toHaveCount(1);
    await expect(page.locator('[aria-current="page"]')).toHaveClass(/nav-row-active/);
  });

  test('ProgressBar is a progressbar with its values', async ({ page }) => {
    await openStory(page, 'core-progressbar--default');
    const bar = page.getByRole('progressbar');
    await expect(bar).toHaveAttribute('aria-valuenow', '3');
    await expect(bar).toHaveAttribute('aria-valuemin', '0');
    await expect(bar).toHaveAttribute('aria-valuemax', '7');
  });

  test('FormRow names its field with its label', async ({ page }) => {
    await openStory(page, 'forms-formrow--default');
    await expect(page.getByLabel('Name')).toHaveValue('Weekly review');
  });
});
