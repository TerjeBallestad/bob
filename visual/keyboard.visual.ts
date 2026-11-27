import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { FOCUS_GUARDS, KNOWN_CONTRAST, TAGS } from './axe';
import { expect, openStory, test } from './fixtures';

// Keyboard behaviour in a real browser (PLAN-005 TASK-032). A gap would be a test marked
// test.fail(): it documents what is missing and fails as soon as the gap is closed. None is left.
// Modal, Select, SegToggle and ToastStack run on Base UI primitives (DD-034, DD-036), which do
// the focus trap, the roving tabindex, the listbox keys and the toast timers; Bob writes none of
// it by hand. These tests check that Bob's wiring keeps that behaviour.

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
  // Base UI's Select (DD-036): the trigger is a combobox button, the list a listbox in a portal
  // at the end of <body>. The story's value is "inbox" (Inbox, Exploring, Planned, Done).
  const trigger = (page: Page) => page.getByRole('combobox', { name: 'Stage' });
  const listbox = (page: Page) => page.getByRole('listbox');

  test.beforeEach(async ({ page }) => {
    await openStory(page, 'forms-select--default');
  });

  test('Tab focuses the trigger, a combobox that shows the label of its value', async ({ page }) => {
    await page.keyboard.press('Tab');
    await expect(trigger(page)).toBeFocused();
    await expect(trigger(page)).toHaveText('Inbox');
    await expect(trigger(page)).toHaveAttribute('aria-haspopup', 'listbox');
    await expect(trigger(page)).toHaveAttribute('aria-expanded', 'false');
  });

  for (const key of ['Enter', ' ', 'ArrowDown']) {
    test(`${key === ' ' ? 'Space' : key} opens the list, with focus on the chosen item`, async ({ page }) => {
      await page.keyboard.press('Tab');
      await page.keyboard.press(key);
      await expect(listbox(page)).toBeVisible();
      await expect(trigger(page)).toHaveAttribute('aria-expanded', 'true');
      await expect(page.getByRole('option', { name: 'Inbox' })).toBeFocused();
      await expect(page.getByRole('option', { name: 'Inbox' })).toHaveAttribute('aria-selected', 'true');
    });
  }

  test('the arrow keys move through the items, and Enter chooses one and closes the list', async ({ page }) => {
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('option', { name: 'Inbox' })).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('option', { name: 'Exploring' })).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('option', { name: 'Planned' })).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await expect(page.getByRole('option', { name: 'Exploring' })).toBeFocused();
    await page.keyboard.press('End');
    await expect(page.getByRole('option', { name: 'Done' })).toBeFocused();
    await page.keyboard.press('Home');
    await expect(page.getByRole('option', { name: 'Inbox' })).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(listbox(page)).toHaveCount(0);
    await expect(trigger(page)).toHaveText('Exploring');
    await expect(trigger(page)).toBeFocused();
  });

  test('typeahead: a letter moves to the next item that starts with it', async ({ page }) => {
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('option', { name: 'Inbox' })).toBeFocused();
    await page.keyboard.type('p');
    await expect(page.getByRole('option', { name: 'Planned' })).toBeFocused();
    // Letters typed within a moment make one search ("pd"); a pause starts a new one.
    await page.waitForTimeout(1000);
    await page.keyboard.type('d');
    await expect(page.getByRole('option', { name: 'Done' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(trigger(page)).toHaveText('Done');
  });

  test('Escape closes the list with no change, and focus returns to the trigger', async ({ page }) => {
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('option', { name: 'Inbox' })).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('option', { name: 'Exploring' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(listbox(page)).toHaveCount(0);
    await expect(trigger(page)).toBeFocused();
    await expect(trigger(page)).toHaveText('Inbox');
  });

  test('Tab leaves: the trigger is one Tab stop; Tab in the open list closes it, with no change', async ({ page }) => {
    // Closed: the next Tab leaves the select (the hidden input takes no focus).
    await page.keyboard.press('Tab');
    await expect(trigger(page)).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(trigger(page)).not.toBeFocused();
    await expect(page.locator('#storybook-root :focus')).toHaveCount(0);
    // Open: Tab closes the list and keeps the value. Base UI gives focus back to the trigger
    // (the APG pattern moves it on), and the next Tab leaves.
    await page.keyboard.press('Shift+Tab');
    await expect(trigger(page)).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('option', { name: 'Inbox' })).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Tab');
    await expect(listbox(page)).toHaveCount(0);
    await expect(trigger(page)).toHaveText('Inbox');
    await expect(trigger(page)).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(trigger(page)).not.toBeFocused();
  });

  test('a FormRow label names the trigger', async ({ page }) => {
    await openStory(page, 'forms-select--choose-an-option');
    const named = page.getByRole('combobox', { name: 'Stage' });
    await expect(named).toBeVisible();
    const id = await named.getAttribute('id');
    await expect(page.locator(`label[for="${id}"]`)).toHaveText('Stage');
    // The label clicks its button, so a click on it opens the list (a native select only took
    // focus). The docs and the migration guide say so.
    await page.locator(`label[for="${id}"]`).click();
    await expect(page.getByRole('listbox')).toBeVisible();
  });

  test('aria-invalid on the trigger shows the error border', async ({ page }) => {
    await openStory(page, 'forms-states--fields');
    const invalid = page.getByRole('combobox', { name: 'select error' });
    await expect(invalid).toHaveAttribute('aria-invalid', 'true');
    await expect(invalid).toHaveCSS('border-top-color', 'rgb(229, 72, 77)');
  });

  // a11y.visual.ts runs axe inside #storybook-root. The open list is in a portal outside it, so
  // these run axe on the whole page, with the exclusions of a11y.visual.ts: Base UI's focus
  // guards (visual/axe.ts) and the known contrast failures of --text-muted (TASK-035).
  for (const story of ['forms-select--open', 'forms-select--groups']) {
    test(`axe finds nothing on the open list (${story})`, async ({ page }) => {
      await openStory(page, story);
      await expect(listbox(page)).toBeVisible();
      const { violations } = await new AxeBuilder({ page }).withTags(TAGS).exclude(FOCUS_GUARDS).analyze();
      const knownFg = KNOWN_CONTRAST.filter((k) => !k.bg && !k.within).map((k) => k.fg);
      const found = violations.flatMap((v) =>
        v.nodes
          .filter((n) => v.id !== 'color-contrast' || !knownFg.includes((n.any[0]?.data as { fgColor?: string })?.fgColor ?? ''))
          .map((n) => `${v.id}: ${n.html}`),
      );
      expect(found).toEqual([]);
    });
  }
});

test.describe('SegToggle', () => {
  // Base UI's ToggleGroup (DD-034): the group is one Tab stop, and the arrow keys move between
  // the segments.
  test('the group is one Tab stop, on the active segment; aria-pressed marks it', async ({ page }) => {
    await openStory(page, 'core-segtoggle--default');
    await expect(page.getByRole('group')).toBeVisible();
    await page.keyboard.press('Tab');
    const week = page.getByRole('button', { name: 'week' });
    await expect(week).toBeFocused();
    await expect(week).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('button', { name: 'day' })).toHaveAttribute('aria-pressed', 'false');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: /^(day|week|month)$/ }).and(page.locator(':focus'))).toHaveCount(0);
  });

  test('with no active segment, Tab lands on the first one', async ({ page }) => {
    await openStory(page, 'core-states--seg-toggle-no-value');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'day' })).toBeFocused();
  });

  test('arrow keys move between the segments, and wrap; Home and End go to the ends', async ({ page }) => {
    await openStory(page, 'core-segtoggle--default');
    await page.keyboard.press('Tab');
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('button', { name: 'month' })).toBeFocused({ timeout: 1000 });
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
  // Base UI's toast manager and viewport (DD-036). Bob's viewport is not a live region; two live
  // regions beside it read each toast once: polite for a success, assertive for an error.
  test('one live region reads each toast: no live region or status role inside another', async ({ page }) => {
    await openStory(page, 'feedback-toast--success-and-error');
    await expect(page.getByRole('dialog', { name: 'Could not save' })).toBeVisible();
    const shape = await page.evaluate(() => {
      const live = [...document.querySelectorAll('[aria-live]')].filter((el) => el.getAttribute('aria-live') !== 'off');
      const liveRoles = '[role="status"], [role="alert"], [role="log"], [aria-live]';
      return {
        live: live.map((el) => el.getAttribute('aria-live')),
        // A live region or a live role inside a live region is read twice by some screen readers.
        nested: live.flatMap((el) => [...el.querySelectorAll(liveRoles)].filter((n) => n.getAttribute('aria-live') !== 'off').map((n) => n.outerHTML)),
        insideLive: live.filter((el) => el.parentElement?.closest(liveRoles)).length,
        // Each toast's title, and the live regions whose text holds it.
        readBy: Object.fromEntries(
          [...document.querySelectorAll('.toast-title')].map((t) => [t.textContent, live.filter((el) => el.textContent!.includes(t.textContent!)).map((el) => el.getAttribute('aria-live'))]),
        ),
        stack: document.querySelector('.toast-stack')!.getAttribute('aria-live'),
      };
    });
    expect(shape.stack).toBe('off');
    expect(shape.nested).toEqual([]);
    expect(shape.insideLive).toBe(0);
    expect(shape.readBy).toEqual({ Saved: ['polite'], 'Could not save': ['assertive'] });
  });

  test('a toast is a dialog named by its title, with a Close button that a screen reader can see', async ({ page }) => {
    await openStory(page, 'feedback-toast--success-and-error');
    const error = page.getByRole('dialog', { name: 'Could not save' });
    await expect(error).toHaveClass(/toast-error/);
    await expect(error.getByRole('button', { name: 'Close' })).toBeVisible();
    // Nothing a screen reader cannot see takes focus (WCAG 4.1.2).
    await expect(page.locator('.toast-stack [aria-hidden="true"]')).toHaveCount(0);
  });

  test.describe('keys, timers and swipe', () => {
    // The story's toasts close themselves after 1.5 s.
    test.beforeEach(async ({ page }) => {
      await openStory(page, 'feedback-states--toast-keyboard');
    });
    const add = async (page: Page, button = 'Save') => {
      await page.getByRole('button', { name: button }).focus();
      await page.keyboard.press('Enter');
    };

    test('a toast closes itself after its timeout', async ({ page }) => {
      await add(page);
      await expect(page.getByRole('dialog', { name: 'Title updated' })).toBeVisible();
      await expect(page.getByRole('dialog')).toHaveCount(0, { timeout: 4000 });
    });

    test('the pointer over the stack pauses the timer, and leaving it starts it again', async ({ page }) => {
      await add(page);
      await page.getByRole('dialog', { name: 'Title updated' }).hover();
      await page.waitForTimeout(2500);
      await expect(page.getByRole('dialog', { name: 'Title updated' })).toBeVisible();
      await page.mouse.move(5, 5);
      await expect(page.getByRole('dialog')).toHaveCount(0, { timeout: 4000 });
    });

    test('F6 moves focus to the stack and pauses the timer; Tab reaches the toast and its Close button', async ({ page }) => {
      await add(page);
      await page.keyboard.press('F6');
      await expect(page.getByRole('region', { name: 'Notifications' })).toBeFocused();
      await page.waitForTimeout(2500);
      await expect(page.getByRole('dialog', { name: 'Title updated' })).toBeVisible();
      await page.keyboard.press('Tab');
      await expect(page.getByRole('dialog', { name: 'Title updated' })).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(page.getByRole('button', { name: 'Close' })).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(page.getByRole('dialog')).toHaveCount(0);
    });

    test('Shift+Tab from the stack gives focus back to where it was before F6', async ({ page }) => {
      await add(page, 'Fail');
      await page.keyboard.press('F6');
      await expect(page.getByRole('region', { name: 'Notifications' })).toBeFocused();
      await page.keyboard.press('Shift+Tab');
      await expect(page.getByRole('button', { name: 'Fail' })).toBeFocused();
    });

    test('Escape closes the focused toast', async ({ page }) => {
      await add(page);
      await page.keyboard.press('F6');
      await page.keyboard.press('Tab');
      await expect(page.getByRole('dialog', { name: 'Title updated' })).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog')).toHaveCount(0);
    });

    test('a swipe to the right closes a toast', async ({ page }) => {
      await add(page);
      const box = (await page.getByRole('dialog', { name: 'Title updated' }).boundingBox())!;
      await page.mouse.move(box.x + 20, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + 120, box.y + box.height / 2, { steps: 10 });
      await page.mouse.up();
      await page.mouse.move(5, 5);
      await expect(page.getByRole('dialog')).toHaveCount(0, { timeout: 700 });
    });
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
