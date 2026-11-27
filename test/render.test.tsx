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
    // built bob.css. Base UI adds a class of its own, with its own <style>, to Select's list
    // (base-ui-disable-scrollbar).
    it(`${name} renders from the built package with Bob's class names`, () => {
      const html = renderHtml(samples[name]());
      const classes = [...html.matchAll(/class="([^"]*)"/g)].flatMap((m) => m[1].split(/\s+/)).filter((c) => c && !c.startsWith('base-ui-'));
      expect(classes.length).toBeGreaterThan(0);
      for (const cls of classes) expect(css, cls).toMatch(new RegExp(`\\.${cls}[{:]`));
    });
  }

  it('the stylesheet holds the tokens, and importing the package loads it', () => {
    expect(readFileSync('dist/bob.css', 'utf8')).toContain('--bg-accent:');
    expect(readFileSync('dist/index.js', 'utf8').startsWith("import './bob.css';")).toBe(true);
  });
});

describe('Button', () => {
  const button = (el: JSX.Element) => {
    const host = document.createElement('div');
    host.innerHTML = renderHtml(el);
    return host.querySelector('button')!;
  };

  it('text renders btn and btn-text, with no size class, and is type="button" unless the app says otherwise', () => {
    const text = button(<Bob.Button variant="text" size="sm" className="text-muted">stop</Bob.Button>);
    expect(text.className).toBe('btn btn-text text-muted');
    expect(text.getAttribute('type')).toBe('button');
    expect(button(<Bob.Button variant="text" type="submit">send</Bob.Button>).getAttribute('type')).toBe('submit');
  });

  it('danger-tint at size xs renders btn-xs and btn-danger-tint, for a stop button in a row', () => {
    const stop = button(<Bob.Button variant="danger-tint" size="xs" className="font-mono">stop</Bob.Button>);
    expect(stop.className).toBe('btn btn-xs btn-danger-tint font-mono');
  });

  it('the other variants keep the native default type', () => {
    const save = button(<Bob.Button variant="ghost">Save</Bob.Button>);
    expect(save.className).toBe('btn btn-md btn-ghost');
    expect(save.hasAttribute('type')).toBe(false);
  });
});

describe('className on Modal and SectionLabel', () => {
  const host = (el: JSX.Element) => {
    const div = document.createElement('div');
    div.innerHTML = renderHtml(el);
    return div;
  };

  it("Modal puts it on the box, after Bob's class", () => {
    const box = host(<Bob.Modal open title="Title" className="w-[720px]">Body</Bob.Modal>).querySelector('[role="dialog"]')!;
    expect(box.className).toBe('modal-box w-[720px]');
    expect(host(<Bob.Modal open title="Title">Body</Bob.Modal>).querySelector('[role="dialog"]')!.className).toBe('modal-box');
  });

  it("SectionLabel puts it on the label, after Bob's class", () => {
    expect(host(<Bob.SectionLabel className="mt-5">Planned</Bob.SectionLabel>).querySelector('[class^="section-label"]')!.className).toBe('section-label mt-5');
    expect(host(<Bob.SectionLabel>Planned</Bob.SectionLabel>).querySelector('[class^="section-label"]')!.className).toBe('section-label');
  });
});
