import React from 'react';
import {
  PAIRS,
  ROLE_GROUPS,
  SURFACES,
  TEXT_ROLES,
  Tokens,
  contrast,
  grade,
  hex,
  luminance,
  over,
  pairBackground,
  parseColor,
  type Rgba,
} from './model';

// The page reads the token files themselves, so it cannot drift from them.
const sources = import.meta.glob('../../src/tokens/*.css', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
// Component CSS: the CSS modules, and the @utility classes that replace them (PLAN-005 Task 1).
const componentCss = {
  ...import.meta.glob('../../src/components/**/*.module.css', { query: '?raw', import: 'default', eager: true }),
  ...import.meta.glob('../../src/tailwind/*.css', { query: '?raw', import: 'default', eager: true }),
} as Record<string, string>;
export const tokens = new Tokens(...Object.values(sources));

const short = (name: string) => name.replace(/^--/, '');
const css = (c: Rgba) => (c.a < 1 ? `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})` : hex(c));
/** Dark or light ink for a label on a swatch, whichever reads better. */
const ink = (c: Rgba) => (luminance(c) > 0.18 ? 'var(--text-on-accent)' : 'var(--text-primary)');
const card = () => tokens.color('--bg-card');

const mono: React.CSSProperties = { fontFamily: 'var(--mono)' };

export function Frame({ eyebrow, title, lede, children }: { eyebrow: string; title: string; lede?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--bg-app)', color: 'var(--text-primary)', fontFamily: 'var(--sans)', padding: '26px 28px 28px', minHeight: 600, boxSizing: 'border-box' }}>
      <div style={{ fontSize: 'var(--fs-tiny)', letterSpacing: 'var(--ls-label)', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>{eyebrow}</div>
      <h2 style={{ fontSize: 'var(--fs-display)', fontWeight: 600, letterSpacing: 'var(--ls-heading)', margin: '6px 0 0' }}>{title}</h2>
      {lede && <p style={{ fontSize: 'var(--fs-body)', color: 'var(--text-secondary)', margin: '6px 0 0', maxWidth: 640, lineHeight: 1.5 }}>{lede}</p>}
      <div style={{ marginTop: 22 }}>{children}</div>
    </div>
  );
}

const Label = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ fontSize: 'var(--fs-micro)', letterSpacing: 'var(--ls-label)', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, ...style }}>{children}</div>
);

/* ---------- Gray ---------- */

const BANDS = [
  { from: 1, to: 13, name: 'Surfaces' },
  { from: 14, to: 21, name: 'Borders' },
  { from: 22, to: 26, name: 'Text' },
];

export function GrayScale() {
  const grays = tokens.steps().filter((s) => s.scale === 'gray' && s.alpha === undefined);
  const byStep = tokens.rolesByStep();
  const w = 26;
  return (
    <Frame
      eyebrow="Colour · scale"
      title="Gray"
      lede={`${grays.length} steps from dark to light. Surfaces sit close together, a single level apart in places: depth in Bob comes from 1px borders, not from big jumps in shade.`}
    >
      <div style={{ display: 'flex', gap: 2 }}>
        {grays.map((s) => {
          const c = parseColor(s.value)!;
          const used = byStep.has(s.name);
          return (
            <div key={s.name} style={{ width: w, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ ...mono, fontSize: 'var(--fs-tiny)', color: used ? 'var(--text-secondary)' : 'var(--text-faint)' }}>{s.step}</div>
              <div style={{ width: w, height: 150, background: s.value, borderRadius: 3, boxShadow: 'inset 0 0 0 1px var(--border-subtle)' }} />
              <div style={{ ...mono, fontSize: 'var(--fs-micro)', color: 'var(--text-muted)', writingMode: 'vertical-rl', transform: 'rotate(180deg)', height: 50, textAlign: 'right' }}>{hex(c)}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 2, marginTop: 6 }}>
        {BANDS.map((b) => (
          <div key={b.name} style={{ width: (b.to - b.from + 1) * (w + 2) - 2, borderTop: '1px solid var(--border-strong)', paddingTop: 6 }}>
            <Label>
              {b.name} <span style={{ ...mono, color: 'var(--text-faint)', letterSpacing: 0 }}>{b.from}–{b.to}</span>
            </Label>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20, columns: 3, columnGap: 18 }}>
        {grays
          .filter((s) => byStep.has(s.name))
          .map((s) => (
            <div key={s.name} style={{ display: 'flex', gap: 8, alignItems: 'baseline', fontSize: 'var(--fs-caption)', lineHeight: '19px', breakInside: 'avoid' }}>
              <span style={{ ...mono, color: 'var(--text-secondary)', width: 50, flex: 'none' }}>{short(s.name)}</span>
              <span style={{ ...mono, color: 'var(--text-muted)', fontSize: 'var(--fs-tiny)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {byStep.get(s.name)!.map(short).join(' · ')}
              </span>
            </div>
          ))}
      </div>
    </Frame>
  );
}

/* ---------- Hues ---------- */

const HUES = ['indigo', 'blue', 'green', 'orange', 'purple', 'yellow', 'red', 'gold'];
const RADIX = [
  { from: 1, to: 2, name: 'Background' },
  { from: 3, to: 5, name: 'Fill' },
  { from: 6, to: 8, name: 'Border' },
  { from: 9, to: 10, name: 'Solid' },
  { from: 11, to: 12, name: 'Text' },
];

export function HueScales() {
  const steps = tokens.steps();
  const byStep = tokens.rolesByStep();
  const slot = 42;
  const gap = 4;
  const nameW = 64;
  return (
    <Frame
      eyebrow="Colour · scales"
      title="Hues"
      lede="Each hue sits on the 12 steps of Radix Colors. Bob fills the steps it uses today; the empty ones are room for the design pass. Alpha steps are the solid at an opacity, shown here as a chip on a card."
    >
      <div style={{ display: 'flex', gap, marginLeft: nameW }}>
        {RADIX.map((b) => (
          <div key={b.name} style={{ width: (b.to - b.from + 1) * (slot + gap) - gap, flex: 'none', borderBottom: '1px solid var(--border-strong)', paddingBottom: 4 }}>
            <Label>{b.name}</Label>
          </div>
        ))}
        <Label style={{ marginLeft: 14, alignSelf: 'flex-end', paddingBottom: 5 }}>Alpha</Label>
      </div>
      <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
        {HUES.map((hue) => {
          const mine = steps.filter((s) => s.scale === hue);
          return (
            <div key={hue} style={{ display: 'flex', alignItems: 'center', gap }}>
              <div style={{ width: nameW, flex: 'none', fontSize: 'var(--fs-body)', fontWeight: 500 }}>{hue}</div>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => {
                const s = mine.find((x) => x.step === n && x.alpha === undefined);
                if (!s)
                  return (
                    <div key={n} style={{ width: slot, flex: 'none', height: 40, borderRadius: 5, border: '1px dashed var(--border-subtle)', boxSizing: 'border-box', display: 'grid', placeItems: 'center', ...mono, fontSize: 'var(--fs-micro)', color: 'var(--text-faint)' }}>
                      {n}
                    </div>
                  );
                const c = parseColor(s.value)!;
                const roles = byStep.get(s.name) ?? [];
                return (
                  <div key={n} title={[s.name, hex(c), ...roles.map(short)].join(' ')} style={{ width: slot, flex: 'none', height: 40, borderRadius: 5, background: s.value, color: ink(c), padding: '4px 5px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <span style={{ ...mono, fontSize: 'var(--fs-tiny)', fontWeight: 600 }}>{n}</span>
                    <span style={{ ...mono, fontSize: 8, opacity: 0.8, whiteSpace: 'nowrap', overflow: 'hidden' }}>{hex(c).slice(1)}</span>
                  </div>
                );
              })}
              <div style={{ display: 'flex', gap: 4, marginLeft: 10, flexWrap: 'wrap' }}>
                {mine
                  .filter((s) => s.alpha !== undefined)
                  .map((s) => {
                    const c = parseColor(s.value)!;
                    return (
                      <span key={s.name} title={s.name} style={{ ...mono, fontSize: 'var(--fs-micro)', padding: '2px 5px', borderRadius: 'var(--radius-kbd)', background: css(over(c, card())), color: hex(c) }}>
                        {s.step}·a{s.alpha}
                      </span>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 24, marginTop: 22, fontSize: 'var(--fs-caption)', color: 'var(--text-secondary)' }}>
        {[
          ['white', 'text on a solid fill (Button accent, danger)'],
          ['black-a40 · a45 · a50 · a55 · a75', 'shadows'],
          ['gray-1-a55', 'the modal scrim'],
        ].map(([n, use]) => (
          <div key={n}>
            <span style={{ ...mono, color: 'var(--text-primary)' }}>{n}</span> <span style={{ color: 'var(--text-muted)' }}>{use}</span>
          </div>
        ))}
      </div>
    </Frame>
  );
}

/* ---------- Roles ---------- */

function RoleRow({ name }: { name: string }) {
  const chain = tokens.chain(name);
  const c = tokens.color(name);
  const fill = c.a < 1 ? css(over(c, card())) : hex(c);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '16px 150px 1fr auto', alignItems: 'center', gap: 8, height: 22, fontSize: 'var(--fs-caption)' }}>
      <span style={{ width: 16, height: 16, borderRadius: 4, background: fill, boxShadow: 'inset 0 0 0 1px var(--border-strong)' }} />
      <span style={{ ...mono, color: 'var(--text-primary)' }}>{short(name)}</span>
      <span style={{ ...mono, color: 'var(--text-muted)', fontSize: 'var(--fs-tiny)', whiteSpace: 'nowrap' }}>
        {chain.slice(1, -1).map((n) => short(n) + ' › ')}
        <span style={{ color: 'var(--text-accent)' }}>{short(chain.at(-1)!)}</span>
      </span>
      <span style={{ ...mono, color: 'var(--text-faint)', fontSize: 'var(--fs-micro)' }}>{c.a < 1 ? `${hex(c)} ${Math.round(c.a * 100)}%` : hex(c)}</span>
    </div>
  );
}

function RoleColumns({ groups }: { groups: typeof ROLE_GROUPS }) {
  return (
    <div style={{ columns: 2, columnGap: 28 }}>
      {groups.map((g) => (
        <div key={g.title} style={{ breakInside: 'avoid', marginBottom: 14 }}>
          <Label style={{ marginBottom: 4 }}>{g.title}</Label>
          {g.roles.map((r) => (
            <RoleRow key={r} name={r} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function RolesNeutral() {
  return (
    <Frame eyebrow="Colour · roles" title="Backgrounds and borders" lede="A role says what a colour is for and points at a scale step. Each role is one token, named like its Tailwind class, for one property. Components use roles.">
      <RoleColumns groups={ROLE_GROUPS.slice(0, 2)} />
    </Frame>
  );
}

export function RolesHue() {
  return (
    <Frame eyebrow="Colour · roles" title="Text and tints" lede="Colour carries meaning, not decoration. It shows up mostly as an 8–12% tint behind small text; tints are shown here over a card.">
      <RoleColumns groups={ROLE_GROUPS.slice(2)} />
    </Frame>
  );
}

/* ---------- Contrast ---------- */

const GRADE_COLOR: Record<string, string> = { AAA: 'var(--text-green)', AA: 'var(--text-green)', 'large only': 'var(--text-orange)', fail: 'var(--text-danger)' };
const Badge = ({ g }: { g: string }) => (
  <span style={{ fontSize: 'var(--fs-micro)', fontWeight: 600, color: GRADE_COLOR[g], textTransform: 'uppercase', letterSpacing: '0.04em' }}>{g === 'large only' ? 'large' : g}</span>
);

export function ContrastText() {
  const cell = 56;
  const failing = TEXT_ROLES.filter((fg) => SURFACES.some((bg) => contrast(tokens.color(fg), tokens.color(bg)) < 4.5));
  return (
    <Frame
      eyebrow="Colour · accessibility"
      title="Text on surfaces"
      lede={
        <>
          WCAG 2.2 contrast of each text role on each surface, computed from the tokens. AA asks 4.5:1 for body text; Bob's text is all under 18px, so 3:1 ("large") does not count.{' '}
          <span style={{ color: 'var(--text-primary)' }}>{failing.map(short).join(' and ')} fail AA on every surface.</span>
        </>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: `86px repeat(${SURFACES.length}, ${cell}px)`, gap: 2 }}>
        <div />
        {SURFACES.map((bg) => (
          <div key={bg} style={{ ...mono, fontSize: 8.5, color: 'var(--text-muted)', textAlign: 'center', paddingBottom: 4, lineHeight: 1.3 }}>
            {short(bg).replace('bg-', '')}
            <div style={{ color: 'var(--text-faint)' }}>{short(tokens.stepFor(bg)!)}</div>
          </div>
        ))}
        {TEXT_ROLES.map((fg) => (
          <React.Fragment key={fg}>
            <div style={{ ...mono, fontSize: 'var(--fs-tiny)', color: 'var(--text-secondary)', alignSelf: 'center' }}>
              {short(fg)}
              <div style={{ color: 'var(--text-faint)', fontSize: 'var(--fs-micro)' }}>{short(tokens.stepFor(fg)!)}</div>
            </div>
            {SURFACES.map((bg) => {
              const r = contrast(tokens.color(fg), tokens.color(bg));
              return (
                <div key={bg} style={{ height: 62, background: `var(${bg})`, borderRadius: 4, boxShadow: 'inset 0 0 0 1px var(--border-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                  <span style={{ color: `var(${fg})`, fontSize: 'var(--fs-title)', fontWeight: 500, lineHeight: 1 }}>Aa</span>
                  <span style={{ ...mono, fontSize: 'var(--fs-micro)', color: 'var(--text-secondary)' }}>{r.toFixed(1)}</span>
                  <Badge g={grade(r)} />
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 18, marginTop: 16, fontSize: 'var(--fs-caption)', color: 'var(--text-muted)' }}>
        <span><Badge g="AAA" /> 7:1 and up</span>
        <span><Badge g="AA" /> 4.5:1 and up</span>
        <span><Badge g="large only" /> 3 to 4.5:1, large text only</span>
        <span><Badge g="fail" /> under 3:1</span>
      </div>
    </Frame>
  );
}

export function ContrastPairs() {
  return (
    <Frame eyebrow="Colour · accessibility" title="Colour pairs in use" lede="The text and fill pairs Bob's components render. A tint is painted over the card it sits on before the ratio is taken.">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 24, rowGap: 6 }}>
        {PAIRS.map((p) => {
          const bg = pairBackground(tokens, p);
          const r = contrast(tokens.color(p.fg), bg);
          return (
            <div key={p.use} style={{ display: 'grid', gridTemplateColumns: '64px 1fr 34px 44px', alignItems: 'center', gap: 8, height: 44, borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ background: css(bg), color: hex(tokens.color(p.fg)), borderRadius: 'var(--radius-chip)', padding: '4px 0', textAlign: 'center', fontSize: 'var(--fs-caption)', fontWeight: 600, boxShadow: 'inset 0 0 0 1px var(--border-subtle)' }}>Label</span>
              <span style={{ fontSize: 'var(--fs-caption)', lineHeight: 1.35 }}>
                {p.use}
                <div style={{ ...mono, fontSize: 'var(--fs-micro)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {short(p.fg)} on {short(p.tint ?? p.bg)}
                </div>
              </span>
              <span style={{ ...mono, fontSize: 'var(--fs-tiny)', color: 'var(--text-secondary)', textAlign: 'right' }}>{r.toFixed(2)}</span>
              <Badge g={grade(r)} />
            </div>
          );
        })}
      </div>
    </Frame>
  );
}

/* ---------- Type ---------- */

const SIZES = ['--fs-micro', '--fs-tiny', '--fs-caption', '--fs-body', '--fs-base', '--fs-prose', '--fs-title', '--fs-headline', '--fs-display'];
const comment = (file: string, name: string) => {
  const src = Object.entries(sources).find(([k]) => k.endsWith(file))?.[1] ?? '';
  return new RegExp(`${name}:[^;]+;\\s*/\\*\\s*([^*]+?)\\s*\\*/`).exec(src)?.[1] ?? '';
};

export function TypeScale() {
  return (
    <Frame eyebrow="Type" title="Size ramp" lede="A dense UI: 13px body, odd half-pixel steps on purpose, no modular scale. Mono is for identity and measurement: ids, counts, timestamps.">
      <div style={{ display: 'grid', gap: 0 }}>
        {SIZES.map((t) => (
          <div key={t} style={{ display: 'grid', gridTemplateColumns: '92px 46px 1fr', alignItems: 'baseline', gap: 12, padding: '7px 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ ...mono, fontSize: 'var(--fs-tiny)', color: 'var(--text-secondary)' }}>{short(t)}</span>
            <span style={{ ...mono, fontSize: 'var(--fs-tiny)', color: 'var(--text-faint)' }}>{tokens.decls.get(t)}</span>
            <span style={{ fontSize: `var(${t})`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Plan the sprint <span style={{ color: 'var(--text-muted)' }}>· {comment('typography.css', t)}</span>
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 28, marginTop: 18, alignItems: 'baseline' }}>
        {['--fw-regular', '--fw-medium', '--fw-semibold', '--fw-bold'].map((w) => (
          <div key={w}>
            <div style={{ fontSize: 'var(--fs-title)', fontWeight: `var(${w})` as unknown as number }}>Bob {tokens.decls.get(w)}</div>
            <div style={{ ...mono, fontSize: 'var(--fs-micro)', color: 'var(--text-muted)' }}>{short(w)}</div>
          </div>
        ))}
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ ...mono, fontSize: 'var(--fs-body)' }}>PLAN-005 · 3/7 · 2d</div>
          <div style={{ ...mono, fontSize: 'var(--fs-micro)', color: 'var(--text-muted)' }}>--mono JetBrains Mono</div>
        </div>
      </div>
    </Frame>
  );
}

/* ---------- Shape and space ---------- */

const RADII = ['--radius-xs', '--radius-sm', '--radius-kbd', '--radius-chip', '--radius-btn', '--radius', '--radius-lg', '--radius-xl'];
const RADIUS_USE: Record<string, string> = {
  '--radius-xs': 'rounded-xs: progress',
  '--radius-sm': 'rounded-sm',
  '--radius-kbd': 'kbd, mono chip',
  '--radius-chip': 'chip',
  '--radius-btn': 'button, input',
  '--radius': 'rounded-md: card, toast',
  '--radius-lg': 'featured',
  '--radius-xl': 'modal',
};

/** px values of padding, margin and gap in the component CSS, with how often each appears. */
function spacingInUse(): [number, number][] {
  const counts = new Map<number, number>();
  for (const text of Object.values(componentCss))
    for (const d of text.matchAll(/(?:padding|margin|gap)[a-z-]*\s*:\s*([^;]+);/g))
      for (const px of d[1].matchAll(/(\d+(?:\.\d+)?)px/g)) counts.set(+px[1], (counts.get(+px[1]) ?? 0) + 1);
  return [...counts].sort((a, b) => a[0] - b[0]);
}

export function ShapeAndSpace() {
  const spacing = spacingInUse();
  const max = Math.max(...spacing.map(([, n]) => n));
  return (
    <Frame eyebrow="Layout" title="Radius, shadow and space">
      <Label style={{ marginBottom: 10 }}>Radius</Label>
      <div style={{ display: 'flex', gap: 10 }}>
        {RADII.map((r) => (
          <div key={r} style={{ width: 80 }}>
            <div style={{ height: 56, background: 'var(--bg-card)', border: '1px solid var(--border-strong)', borderRadius: `var(${r})` }} />
            <div style={{ ...mono, fontSize: 'var(--fs-tiny)', marginTop: 6 }}>{short(r)} <span style={{ color: 'var(--text-faint)' }}>{tokens.resolve(`var(${r})`)}</span></div>
            <div style={{ fontSize: 'var(--fs-micro)', color: 'var(--text-muted)' }}>{RADIUS_USE[r]}</div>
          </div>
        ))}
      </div>
      <Label style={{ margin: '22px 0 10px' }}>Shadow — floating layers only</Label>
      <div style={{ display: 'flex', gap: 24, background: 'var(--bg-card)', padding: '20px 22px 26px', borderRadius: 'var(--radius)', border: '1px solid var(--border-subtle)' }}>
        {['--shadow-toast', '--shadow-popup', '--shadow-modal', '--shadow-overlay', '--shadow-panel', '--glow-accent'].map((s) => (
          <div key={s} style={{ flex: 1 }}>
            <div style={{ height: 40, background: 'var(--bg-modal)', borderRadius: 'var(--radius)', boxShadow: `var(${s})`, border: '1px solid var(--border-strong)' }} />
            <div style={{ ...mono, fontSize: 'var(--fs-tiny)', marginTop: 8, color: 'var(--text-secondary)' }}>{short(s)}</div>
          </div>
        ))}
      </div>
      <Label style={{ margin: '22px 0 4px' }}>Space — no tokens yet</Label>
      <div style={{ fontSize: 'var(--fs-caption)', color: 'var(--text-muted)', marginBottom: 10 }}>
        Padding, margin and gap values in the component CSS today, drawn to size, and how often each appears. A spacing scale is for the design pass.
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
        {spacing.map(([px, n]) => (
          <div key={px} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, width: 34 }}>
            <div style={{ width: px, height: px, background: 'var(--bg-accent)', borderRadius: 1 }} />
            <span style={{ ...mono, fontSize: 'var(--fs-tiny)', color: 'var(--text-primary)' }}>{px}</span>
            <span style={{ ...mono, fontSize: 'var(--fs-micro)', color: n === max ? 'var(--text-accent)' : 'var(--text-muted)' }}>×{n}</span>
          </div>
        ))}
      </div>
    </Frame>
  );
}

