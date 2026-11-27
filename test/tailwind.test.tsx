// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { compile } from '@tailwindcss/node';
import { Scanner } from '@tailwindcss/oxide';
import { renderHtml, samples } from './samples';

// A Tailwind app that adds Bob with one import (DD-031), built the way @tailwindcss/vite builds
// it: compile the app's CSS, scan the sources it names, build the candidates. The app's own
// files are left out, so every Bob class in the output was found through Bob's `@source`.
// `px-8` stands in for a utility the app uses.
const APP_CSS = `
@layer theme, base, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/utilities.css" layer(utilities);
@import "@terjeballestad/bob/tailwind.css";
@source inline("px-8");
`;

async function buildApp(extra: string[] = []) {
  const compiler = await compile(APP_CSS, { base: process.cwd(), onDependency: () => {} });
  const scanner = new Scanner({ sources: compiler.sources });
  return compiler.build([...scanner.scan(), ...extra]);
}

// Base UI's own classes (base-ui-disable-scrollbar) come with Base UI's own <style>.
const classesOf = (html: string) =>
  [...html.matchAll(/class="([^"]*)"/g)].flatMap((m) => m[1].split(/\s+/)).filter((c) => c && !c.startsWith('base-ui-'));

describe('the Tailwind entry', () => {
  it("builds every class Bob's components render, from Bob's built JS", async () => {
    const css = await buildApp();
    const missing: string[] = [];
    for (const [name, sample] of Object.entries(samples)) {
      for (const cls of classesOf(renderHtml(sample()))) {
        if (!css.includes(`.${cls} {`) && !css.includes(`.${cls}:`)) missing.push(`${name}: ${cls}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it("puts Bob's classes with the app's utilities, so a utility after them wins", async () => {
    const css = await buildApp();
    const utilities = css.slice(css.indexOf('@layer utilities {'));
    expect(utilities.indexOf('.btn-md {')).toBeGreaterThan(0);
    expect(utilities.indexOf('.px-8 {')).toBeGreaterThan(utilities.indexOf('.btn-md {'));
  });

  // A modifier class sets some of the same properties as its base class, so it must come
  // later in the stylesheet. Tailwind sorts utilities by its own rules, not by file order.
  const ORDER: [string, string][] = [
    ['btn', 'btn-primary'], ['btn', 'btn-secondary'], ['btn', 'btn-ghost'], ['btn', 'btn-danger-ghost'],
    ['chip', 'chip-mono'], ['seg-opt', 'seg-active'], ['search', 'search-expand'], ['toast', 'toast-error'], ['nav-row', 'nav-row-active'],
  ];
  const ruleAt = (css: string, cls: string) => css.search(new RegExp(`\\.${cls}\\s*\\{`));

  it('writes each modifier class after its base class, in the app build and in bob.css', async () => {
    for (const css of [await buildApp(), readFileSync('dist/bob.css', 'utf8')]) {
      for (const [base, mod] of ORDER) {
        expect(ruleAt(css, base), base).toBeGreaterThan(-1);
        expect(ruleAt(css, mod), `${mod} after ${base}`).toBeGreaterThan(ruleAt(css, base));
      }
    }
  });

  it('writes no theme variable that refers to itself', async () => {
    const css = await buildApp();
    expect(css).not.toMatch(/(--[\w-]+):\s*var\(\1\)/);
  });

  it("the precompiled stylesheet holds Bob's classes in the base layer, under an app's utilities", () => {
    const sheet = readFileSync('dist/bob.css', 'utf8');
    const start = sheet.indexOf('@layer base{');
    let depth = 0;
    let end = start;
    for (let i = start; i < sheet.length; i++) {
      if (sheet[i] === '{') depth++;
      if (sheet[i] === '}' && --depth === 0) {
        end = i;
        break;
      }
    }
    const layer = sheet.slice(start, end);
    const outside = sheet.slice(0, start) + sheet.slice(end);
    for (const rule of [':root{', '.btn{', '.btn-md{', '.chip{']) expect(layer).toContain(rule);
    // Outside the layer: only the webfont import and Tailwind's @property fallbacks.
    expect(outside.match(/(^|})\.[\w-]+[{:]/g)).toBeNull();
  });

  it('makes each colour role one class of its own property, and each scale step a class of every utility (DD-033)', async () => {
    const yes: [string, string][] = [
      ['bg-card', 'background-color: var(--bg-card)'],
      ['text-primary', 'color: var(--text-primary)'],
      ['text-reading', 'color: var(--text-reading)'],
      ['border-subtle', 'border-color: var(--border-subtle)'],
      ['decoration-strike', 'text-decoration-color: var(--decoration-strike)'],
      ['outline-focus', 'outline-color: var(--outline-focus)'],
      ['bg-gray-3', 'background-color: var(--gray-3)'],
      ['text-indigo-9', 'color: var(--indigo-9)'],
      ['border-red-9-a40', 'border-color: var(--red-9-a40)'],
      ['text-white', 'color: var(--white)'],
    ];
    const no = ['text-card', 'bg-primary', 'border-primary', 'bg-gray-500', 'text-text-2', 'bg-surface-card', 'border-border'];
    const css = await buildApp([...yes.map(([c]) => c), ...no]);
    for (const [cls, decl] of yes) {
      const rule = css.match(new RegExp(`\\.${cls} \\{([^}]*)\\}`))?.[1] ?? '';
      expect(rule.trim(), cls).toBe(`${decl};`);
    }
    for (const cls of no) expect(css, cls).not.toContain(`.${cls} {`);
    // Clearing the default palette keeps the colour keywords.
    const keywords = await buildApp(['bg-transparent', 'text-current', 'border-transparent']);
    for (const cls of ['bg-transparent', 'text-current', 'border-transparent']) expect(keywords, cls).toContain(`.${cls} {`);
    // Tailwind's font sizes still work next to Bob's text colours.
    expect(await buildApp(['text-sm'])).toMatch(/\.text-sm \{[^}]*font-size/);
  });

  it("makes Bob's animations theme keys: animate-* classes, with a keyframe only when used", async () => {
    const plain = await buildApp();
    // Bob's components use the live pulse and toast-in, under motion-safe.
    expect(plain).toMatch(/\.ticket-card-live \{[^}]*@media \(prefers-reduced-motion: no-preference\) \{\s*animation: var\(--animate-live\)/);
    expect(plain).toContain('@keyframes live-pulse');
    expect(plain).not.toContain('@keyframes card-in');
    const app = await buildApp(['animate-card-in', 'animate-slide-in', 'animate-pulse']);
    expect(app).toContain('.animate-card-in {');
    expect(app).toContain('@keyframes card-in');
    expect(app).toContain('@keyframes slide-in');
    // Tailwind's animate-pulse keeps its own keyframe: Bob does not define one named pulse.
    expect(app.match(/@keyframes pulse \{[\s\S]*?\n {2}\}/)?.[0]).toContain('opacity: 0.5');
  });
});
