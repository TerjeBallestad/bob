// Reads Bob's token CSS and works out what the colour page shows: the scales,
// the role that points at each step, and WCAG contrast. The Tokens stories and
// test/tokens.test.ts both use it, so the page and the test read the same source.

export type Rgba = { r: number; g: number; b: number; a: number };
export type Decl = { name: string; value: string };

/** Every `--name: value;` declaration in a CSS text, in source order. */
export function parseDecls(css: string): Decl[] {
  const out: Decl[] = [];
  const text = css.replace(/\/\*[\s\S]*?\*\//g, '');
  for (const m of text.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)) out.push({ name: m[1], value: m[2].trim() });
  return out;
}

/** A scale step: `--gray-12`, `--indigo-9`, an alpha step `--red-9-a40` or `--black-a50`, or `--white`. */
export const STEP = /^--([a-z]+)(?:-(\d+))?(?:-a(\d+))?$/;
export const SCALES = ['gray', 'indigo', 'blue', 'green', 'orange', 'purple', 'yellow', 'red', 'gold', 'white', 'black'];

export type Step = { name: string; scale: string; step?: number; alpha?: number; value: string };

export function stepOf(name: string, value: string): Step | null {
  const m = STEP.exec(name);
  if (!m || !SCALES.includes(m[1])) return null;
  if (m[1] === 'white' ? m[2] || m[3] : m[1] === 'black' ? m[2] || !m[3] : !m[2]) return null;
  return { name, scale: m[1], step: m[2] ? Number(m[2]) : undefined, alpha: m[3] ? Number(m[3]) : undefined, value };
}

export function parseColor(value: string): Rgba | null {
  const v = value.trim().toLowerCase();
  let m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/.exec(v);
  if (m) {
    const h = m[1].length === 3 ? [...m[1]].map((c) => c + c).join('') : m[1];
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: 1 };
  }
  m = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/.exec(v);
  if (m) return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] };
  return null;
}

/** Colour literals in a value, found anywhere in it (a shadow holds one too). */
export const COLOR_LITERAL = /#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)|\b(?:white|black)\b/gi;

/** A value with each colour literal written one way: `rgba(r, g, b, a)`. */
export function normalize(value: string): string {
  return value.replace(COLOR_LITERAL, (lit) => {
    const c = parseColor(lit);
    return c ? `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})` : lit;
  });
}

export const hex =(c: Rgba) => '#' + [c.r, c.g, c.b].map((n) => Math.round(n).toString(16).padStart(2, '0')).join('');

/** WCAG 2.2 relative luminance. */
export function luminance({ r, g, b }: Rgba): number {
  const lin = (n: number) => {
    const s = n / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** A colour with alpha, painted over an opaque one. */
export function over(top: Rgba, under: Rgba): Rgba {
  const a = top.a;
  return { r: top.r * a + under.r * (1 - a), g: top.g * a + under.g * (1 - a), b: top.b * a + under.b * (1 - a), a: 1 };
}

/** WCAG contrast ratio of a text colour on an opaque background. */
export function contrast(fg: Rgba, bg: Rgba): number {
  const f = luminance(fg.a < 1 ? over(fg, bg) : fg);
  const b = luminance(bg);
  const [hi, lo] = f > b ? [f, b] : [b, f];
  return (hi + 0.05) / (lo + 0.05);
}

/** AA for body text is 4.5:1; 3:1 holds only for large text (18.66px bold or 24px), which Bob does not use. */
export const grade = (ratio: number) => (ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'large only' : 'fail');

export class Tokens {
  readonly decls: Map<string, string>;
  constructor(...css: string[]) {
    this.decls = new Map(css.flatMap(parseDecls).map((d) => [d.name, d.value]));
  }
  /** The chain of names a token goes through, ending at the step that holds the value. */
  chain(name: string): string[] {
    const out = [name];
    let v = this.decls.get(name);
    for (let m; v && (m = /^var\((--[a-z0-9-]+)\)$/.exec(v)); v = this.decls.get(m[1])) out.push(m[1]);
    return out;
  }
  /** The scale step a role points at, through any aliases. */
  stepFor(name: string): string | undefined {
    const last = this.chain(name).at(-1)!;
    return stepOf(last, this.decls.get(last) ?? '') ? last : undefined;
  }
  /** A value with every var() replaced by what it holds, all the way down. */
  resolve(value: string): string {
    return value.replace(/var\((--[a-z0-9-]+)\)/gi, (_, n: string) => {
      const v = this.decls.get(n);
      if (v === undefined) throw new Error(`${n} is not defined`);
      return this.resolve(v);
    });
  }
  value(name: string): string | undefined {
    return this.decls.get(this.chain(name).at(-1)!);
  }
  color(name: string): Rgba {
    const c = parseColor(this.value(name) ?? '');
    if (!c) throw new Error(`${name} is not a colour: ${this.value(name)}`);
    return c;
  }
  steps(): Step[] {
    return [...this.decls].map(([n, v]) => stepOf(n, v)).filter((s): s is Step => s !== null);
  }
  /** Tokens that hold a colour and are not scale steps: the roles. */
  roles(): string[] {
    return [...this.decls.keys()].filter((n) => !stepOf(n, '') && this.stepFor(n));
  }
  /** Roles that point at each step. */
  rolesByStep(): Map<string, string[]> {
    const m = new Map<string, string[]>();
    for (const r of this.roles()) {
      const s = this.stepFor(r)!;
      m.set(s, [...(m.get(s) ?? []), r]);
    }
    return m;
  }
}

/** Text roles and the surfaces they sit on, for the contrast table. */
export const TEXT_ROLES = ['--text', '--text-prose', '--text-2', '--text-3', '--text-4'];
export const SURFACES = [
  '--surface-code',
  '--surface-app',
  '--surface-rail',
  '--surface-sidebar',
  '--surface-overlay',
  '--panel-dim',
  '--surface-card',
  '--surface-modal',
  '--surface-input',
  '--surface-card-hover',
  '--surface-toast',
];

/** Colour pairs the components use today: text colour, background, and what renders it. */
export const PAIRS: { fg: string; bg: string; tint?: string; use: string }[] = [
  { fg: '--on-accent', bg: '--accent', use: 'Button primary' },
  { fg: '--white', bg: '--accent-deep', use: 'Button accent' },
  { fg: '--white', bg: '--danger', use: 'Button danger' },
  { fg: '--red-11', bg: '--surface-app', use: 'Button danger-ghost' },
  { fg: '--text-2', bg: '--surface-input', use: 'Button secondary' },
  { fg: '--accent', bg: '--surface-card', tint: '--tint-accent', use: 'Chip accent' },
  { fg: '--blue', bg: '--surface-card', tint: '--tint-blue', use: 'Chip blue' },
  { fg: '--green', bg: '--surface-card', tint: '--tint-green', use: 'Chip green' },
  { fg: '--orange', bg: '--surface-card', tint: '--tint-orange', use: 'Chip orange' },
  { fg: '--danger', bg: '--surface-card', tint: '--tint-danger', use: 'Chip danger' },
  { fg: '--yellow', bg: '--surface-card', tint: '--tint-yellow', use: 'Chip yellow' },
  { fg: '--yellow-11', bg: '--surface-card', tint: '--yellow-11-a10', use: 'Chip claim' },
  { fg: '--purple', bg: '--surface-card', use: 'TicketCard probe' },
  { fg: '--red-12', bg: '--surface-toast', use: 'Toast error' },
];

/** The colour of a pair's background: the tint painted over the surface, or the surface. */
export function pairBackground(t: Tokens, p: { bg: string; tint?: string }): Rgba {
  return p.tint ? over(t.color(p.tint), t.color(p.bg)) : t.color(p.bg);
}

/** The roles in the order the colour page shows them. test/tokens.test.ts checks that it names every role. */
export const ROLE_GROUPS: { title: string; roles: string[] }[] = [
  {
    title: 'Surfaces',
    roles: [
      '--surface-code', '--bg', '--surface-app', '--bg-rail', '--surface-rail', '--bg-side', '--surface-sidebar',
      '--surface-overlay', '--panel-dim', '--panel', '--surface-card', '--surface-modal', '--input', '--surface-input',
      '--panel-hover', '--surface-card-hover', '--surface-toast',
    ],
  },
  { title: 'Borders', roles: ['--border', '--input-border', '--border-2', '--border-card-hover'] },
  {
    title: 'Text',
    roles: [
      '--text', '--text-body', '--text-prose', '--text-2', '--text-secondary', '--text-3', '--text-muted', '--text-4',
      '--text-faint', '--on-accent',
    ],
  },
  {
    title: 'Accent and status',
    roles: ['--accent', '--accent-deep', '--blue', '--green', '--orange', '--purple', '--yellow', '--danger', '--gold'],
  },
  {
    title: 'Tints and scrim',
    roles: ['--tint-accent', '--tint-blue', '--tint-green', '--tint-orange', '--tint-danger', '--tint-yellow', '--scrim'],
  },
];
