import AxeBuilder from '@axe-core/playwright';
import { KNOWN_CONTRAST, NO_CONTRAST_CHECK, TAGS } from './axe';
import { expect, openStory, stories, test } from './fixtures';

// axe on every story in the built Storybook, in its rest state and in the forced hover and focus
// states of stories/states/. A violation fails the test, unless it is a known contrast failure
// (visual/axe.ts, for PLAN-005 TASK-035).

for (const { id } of stories) {
  test(`axe ${id}`, async ({ page }) => {
    await openStory(page, id);
    let axe = new AxeBuilder({ page }).include('#storybook-root').withTags(TAGS);
    if (NO_CONTRAST_CHECK.test(id)) axe = axe.disableRules(['color-contrast']);
    const { violations } = await axe.analyze();

    const found: string[] = [];
    for (const v of violations) {
      for (const node of v.nodes) {
        if (v.id === 'color-contrast') {
          const data = node.any[0]?.data as { fgColor?: string; bgColor?: string; contrastRatio?: number };
          const classes = await page
            .locator(node.target.join(' '))
            .first()
            .evaluate((el) => {
              const all: string[] = [];
              for (let e: Element | null = el; e; e = e.parentElement) all.push(...e.classList);
              return all;
            });
          const known = KNOWN_CONTRAST.some(
            (k) =>
              (!k.fg || k.fg === data.fgColor) &&
              (!k.bg || k.bg === data.bgColor) &&
              (!k.within || classes.includes(k.within)),
          );
          if (known) continue;
          found.push(`${v.id}: ${data.fgColor} on ${data.bgColor} (${data.contrastRatio}) ${node.html}`);
        } else {
          found.push(`${v.id}: ${node.html} (${v.help})`);
        }
      }
    }
    expect(found).toEqual([]);
  });
}
