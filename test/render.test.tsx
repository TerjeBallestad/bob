// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import * as Bob from '@terjeballestad/bob';
import { renderHtml, samples } from './samples';
const css = readFileSync('dist/bob.css', 'utf8');


describe('render', () => {
  const components = Object.keys(Bob).filter((k) => /^[A-Z]/.test(k));

  it('has a render sample for every component', () => {
    expect(Object.keys(samples).sort()).toEqual(components.sort());
  });

  for (const name of Object.keys(samples)) {
    // Every class a component renders is one of Bob's component classes, defined in the
    // built bob.css.
    it(`${name} renders from the built package with Bob's class names`, () => {
      const html = renderHtml(samples[name]());
      const classes = [...html.matchAll(/class="([^"]*)"/g)].flatMap((m) => m[1].split(/\s+/)).filter(Boolean);
      expect(classes.length).toBeGreaterThan(0);
      for (const cls of classes) expect(css, cls).toMatch(new RegExp(`\\.${cls}[{:]`));
    });
  }

  it('the stylesheet holds the tokens, and importing the package loads it', () => {
    expect(readFileSync('dist/bob.css', 'utf8')).toContain('--bg-accent:');
    expect(readFileSync('dist/index.js', 'utf8').startsWith("import './bob.css';")).toBe(true);
  });
});
