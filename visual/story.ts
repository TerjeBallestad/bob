import type { Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

// The built Storybook's stories, from its index (npm run build-storybook first).
type Entry = { id: string; type: string; tags?: string[] };
const index = JSON.parse(readFileSync('storybook-static/index.json', 'utf8')) as { entries: Record<string, Entry> };
export const stories = Object.values(index.entries).filter((e) => e.type === 'story');

export type Finished = { status: 'success' | 'error'; errors: string[] };

/**
 * Opens a story and waits until Storybook reports it finished: rendered, and its play
 * function (if any) run. Storybook announces that on its channel as storyFinished, and a
 * play function that throws as playFunctionThrewException. The init script hooks the
 * channel the moment the preview creates it, so no event is missed.
 */
export async function openStory(page: Page, id: string): Promise<Finished> {
  await page.addInitScript(() => {
    type Channel = { on: (event: string, fn: (payload: any) => void) => void };
    const w = window as unknown as { __bob: { errors: string[]; finished?: unknown }; __STORYBOOK_ADDONS_CHANNEL__?: Channel };
    w.__bob = { errors: [] };
    let channel: Channel | undefined;
    Object.defineProperty(window, '__STORYBOOK_ADDONS_CHANNEL__', {
      configurable: true,
      get: () => channel,
      set: (c: Channel) => {
        channel = c;
        c.on('playFunctionThrewException', (e: { message?: string }) => w.__bob.errors.push(e?.message ?? String(e)));
        c.on('storyErrored', (e: { title?: string; description?: string }) => w.__bob.errors.push(`${e?.title}: ${e?.description}`));
        c.on('storyThrewException', (e: { message?: string }) => w.__bob.errors.push(e?.message ?? String(e)));
        c.on('storyFinished', (e: { status: string }) => (w.__bob.finished = e.status));
      },
    });
  });
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  await page.waitForFunction(() => (window as unknown as { __bob: { finished?: string } }).__bob.finished);
  return page.evaluate(() => {
    const b = (window as unknown as { __bob: { errors: string[]; finished: Finished['status'] } }).__bob;
    return { status: b.finished, errors: b.errors };
  });
}
