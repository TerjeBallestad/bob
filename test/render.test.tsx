import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { renderToString } from 'react-dom/server';
import * as Bob from '@terjeballestad/bob';
import { samples } from './samples';
const css = readFileSync('dist/bob.css', 'utf8');


describe('render', () => {
  const components = Object.keys(Bob).filter((k) => /^[A-Z]/.test(k));

  it('has a render sample for every component', () => {
    expect(Object.keys(samples).sort()).toEqual(components.sort());
  });

  for (const name of Object.keys(samples)) {
    // A component on CSS modules gets scoped names (bob_...). One moved to the Tailwind layer
    // gets Bob's component classes (btn, chip), and the built bob.css must define them.
    it(`${name} renders from the built package with Bob's class names`, () => {
      const html = renderToString(samples[name]());
      const tw = html.match(/class="(btn|chip)\b/);
      if (tw) expect(css).toContain(`.${tw[1]}{`);
      else expect(html).toMatch(/class="[^"]*bob_/);
    });
  }

  it('the stylesheet holds the tokens, and importing the package loads it', () => {
    expect(readFileSync('dist/bob.css', 'utf8')).toContain('--accent:');
    expect(readFileSync('dist/index.js', 'utf8').startsWith("import './bob.css';")).toBe(true);
  });
});
