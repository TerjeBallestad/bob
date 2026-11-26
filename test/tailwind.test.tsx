import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { renderToString } from 'react-dom/server';
import { compile } from '@tailwindcss/node';
import { Scanner } from '@tailwindcss/oxide';
import { samples } from './samples';

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

async function buildApp() {
  const compiler = await compile(APP_CSS, { base: process.cwd(), onDependency: () => {} });
  const scanner = new Scanner({ sources: compiler.sources });
  return compiler.build(scanner.scan());
}

const classesOf = (html: string) =>
  [...html.matchAll(/class="([^"]*)"/g)].flatMap((m) => m[1].split(/\s+/)).filter(Boolean);

describe('the Tailwind entry', () => {
  it("builds every class Bob's components render, from Bob's built JS", async () => {
    const css = await buildApp();
    const missing: string[] = [];
    for (const [name, sample] of Object.entries(samples)) {
      // bob_ classes come from CSS modules not yet moved to @utility.
      for (const cls of classesOf(renderToString(sample())).filter((c) => !c.startsWith('bob_'))) {
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
    ['chip', 'chip-mono'], ['seg-opt', 'seg-active'], ['search', 'search-expand'], ['toast', 'toast-error'],
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
    // Outside the layer: the webfont import, Tailwind's @property fallbacks, and CSS modules
    // not yet moved to @utility (bob_ classes).
    expect(outside.match(/(^|})\.(?!bob_)[\w-]+[{:]/g)).toBeNull();
  });
});
