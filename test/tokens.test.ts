import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import {
  COLOR_LITERAL,
  PAIRS,
  ROLE_GROUPS,
  SURFACES,
  TEXT_ROLES,
  Tokens,
  contrast,
  luminance,
  normalize,
  pairBackground,
  parseColor,
  parseDecls,
  stepOf,
} from '../stories/tokens/model';

const dir = new URL('../src/tokens/', import.meta.url);
const files = readdirSync(dir).filter((f) => f.endsWith('.css'));
const css = Object.fromEntries(files.map((f) => [f, readFileSync(new URL(f, dir), 'utf8')]));
const tokens = new Tokens(...Object.values(css));
const v020: Record<string, string> = JSON.parse(readFileSync(new URL('./fixtures/tokens-0.2.0.json', import.meta.url), 'utf8'));
const old = new Tokens(Object.entries(v020).map(([n, v]) => `${n}: ${v};`).join('\n'));
const renames: Record<string, string[]> = JSON.parse(readFileSync(new URL('./fixtures/renames-1.0.json', import.meta.url), 'utf8'));
delete (renames as Record<string, unknown>)._;
const strip = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, '');

describe('colour tokens', () => {
  it('give each 0.x role its 1.0 names, with the same value, and drop the 0.x name (DD-033)', () => {
    for (const [name, names] of Object.entries(renames)) {
      if (!names.includes(name)) expect(tokens.decls.has(name), `${name} is gone in 1.0`).toBe(false);
      for (const n of names) {
        expect(tokens.decls.has(n), n).toBe(true);
        expect(normalize(tokens.resolve(`var(${n})`)), `${name} -> ${n}`).toBe(normalize(old.resolve(v020[name])));
      }
    }
    // Every 0.2.0 colour role is in the table.
    const colourRoles = Object.keys(v020).filter((n) => parseColor(old.resolve(`var(${n})`)));
    expect(colourRoles.sort()).toEqual(Object.keys(renames).sort());
  });

  it('keep every 0.2.0 token that is not a colour role, with the same value', () => {
    for (const [name, value] of Object.entries(v020)) {
      if (name in renames) continue;
      expect(tokens.decls.has(name), name).toBe(true);
      expect(normalize(tokens.resolve(`var(${name})`)), name).toBe(normalize(old.resolve(value)));
    }
  });

  it('name each role like its class: --bg-*, --border-*, --text-*, --decoration-*, --outline-*', () => {
    for (const r of tokens.roles().filter((r) => !r.startsWith('--shadow') && !r.startsWith('--glow')))
      expect(r, r).toMatch(/^--(bg|border|text|decoration|outline)-[a-z0-9-]+$/);
  });

  it('hold colour literals only in scale steps', () => {
    for (const [file, text] of Object.entries(css)) {
      const outside = strip(text).replace(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi, (decl, name: string) => (stepOf(name, '') ? '' : decl));
      const literals = outside.replace(/@import[^;]+;|var\(--[a-z0-9-]+\)/g, '').match(COLOR_LITERAL) ?? [];
      expect(literals, file).toEqual([]);
    }
  });

  it('make each scale step one colour, and point each role at a step', () => {
    for (const s of tokens.steps()) expect(parseColor(s.value), s.name).not.toBeNull();
    const colorRoles = [...tokens.decls.keys()].filter((n) => !stepOf(n, '') && parseColor(tokens.resolve(`var(${n})`)));
    expect(colorRoles.length).toBeGreaterThan(40);
    for (const r of colorRoles) expect(tokens.stepFor(r), r).toBeDefined();
  });

  it('show every colour role on the colour page, once', () => {
    const shown = ROLE_GROUPS.flatMap((g) => g.roles);
    expect([...shown].sort()).toEqual(tokens.roles().filter((r) => !r.startsWith('--shadow') && !r.startsWith('--glow')).sort());
  });

  it('make an alpha step its solid step at that opacity', () => {
    for (const s of tokens.steps().filter((s) => s.alpha !== undefined)) {
      const c = parseColor(s.value)!;
      expect(c.a, s.name).toBeCloseTo(s.alpha! / 100, 5);
      if (s.scale === 'black') expect([c.r, c.g, c.b], s.name).toEqual([0, 0, 0]);
      else {
        const solid = parseColor(tokens.decls.get(`--${s.scale}-${s.step}`) ?? '');
        expect(solid, `--${s.scale}-${s.step}`).not.toBeNull();
        expect([c.r, c.g, c.b], s.name).toEqual([solid!.r, solid!.g, solid!.b]);
      }
    }
  });

  it('number the solid steps of each scale from dark to light', () => {
    const solids = tokens.steps().filter((s) => s.step !== undefined && s.alpha === undefined);
    for (const scale of new Set(solids.map((s) => s.scale))) {
      const steps = solids.filter((s) => s.scale === scale).sort((a, b) => a.step! - b.step!);
      const lum = steps.map((s) => luminance(parseColor(s.value)!));
      expect(lum, scale).toEqual([...lum].sort((a, b) => a - b));
      if (scale === 'gray') expect(steps.map((s) => s.step)).toEqual(steps.map((_, i) => i + 1));
      else expect(steps.every((s) => s.step! >= 1 && s.step! <= 12), scale).toBe(true);
    }
  });
});

describe('contrast', () => {
  // The findings TOKENS.md states. A colour change that moves a pair across 4.5:1 fails here,
  // and the doc changes with it.
  const failsAA = (fg: string, bg: string) => contrast(tokens.color(fg), tokens.color(bg)) < 4.5;

  it('text-primary, text-reading and text-secondary pass AA on every surface', () => {
    for (const fg of ['--text-primary', '--text-reading', '--text-secondary'])
      for (const bg of SURFACES) expect(failsAA(fg, bg), `${fg} on ${bg}`).toBe(false);
  });

  it('text-muted and text-faint fail AA on every surface', () => {
    for (const fg of ['--text-muted', '--text-faint'])
      for (const bg of SURFACES) expect(failsAA(fg, bg), `${fg} on ${bg}`).toBe(true);
    expect(TEXT_ROLES).toEqual(['--text-primary', '--text-reading', '--text-secondary', '--text-muted', '--text-faint']);
  });

  it('the colour pairs in use: these fail AA', () => {
    const failing = PAIRS.filter((p) => contrast(tokens.color(p.fg), pairBackground(tokens, p)) < 4.5).map((p) => p.use);
    expect(failing).toEqual(['Button danger', 'Chip danger']);
  });
});

it('parseDecls reads declarations in order, without comments', () => {
  expect(parseDecls(':root { /* --x: 1; */ --a: #fff; --b: var(--a); }')).toEqual([
    { name: '--a', value: '#fff' },
    { name: '--b', value: 'var(--a)' },
  ]);
});
