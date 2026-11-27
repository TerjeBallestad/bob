import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

// The grep gate for Bob 1.0 (DD-033): no 0.x colour token and no 0.x colour class is left in
// Bob's source, stories or docs. 1.0 keeps no alias, so a name left behind is a bug.
// test/fixtures/renames-1.0.json lists each 0.x role and its 1.0 names.
const root = new URL('..', import.meta.url).pathname;
const renames: Record<string, string[]> = JSON.parse(readFileSync(join(root, 'test/fixtures/renames-1.0.json'), 'utf8'));
delete (renames as Record<string, unknown>)._;
const kept = new Set(Object.values(renames).flat());

// 0.x tokens: each role name, and the theme key 0.x made from it (--color-text-2).
const oldKeys = Object.keys(renames).map((n) => n.slice(2));
const oldTokens = [
  ...Object.keys(renames).filter((n) => !kept.has(n)),
  ...oldKeys.map((k) => `--color-${k}`),
];

// 0.x classes: every colour utility on every 0.x key (text-text-2, bg-surface-card,
// border-border). A class that 1.0 also makes (bg-card-hover, text-muted) is not old.
const PREFIXES = ['bg', 'text', 'border', 'ring', 'outline', 'fill', 'stroke', 'divide', 'decoration', 'caret', 'accent', 'placeholder', 'shadow', 'from', 'via', 'to'];
const theme = readFileSync(join(root, 'src/tailwind/theme.css'), 'utf8');
const keysIn = (ns: string) => [...theme.matchAll(new RegExp(`--${ns}-([a-z0-9-]+)\\s*:`, 'g'))].map((m) => m[1]);
const scale = keysIn('color').filter((k) => k !== '*');
const newClasses = new Set([
  ...PREFIXES.flatMap((p) => scale.map((k) => `${p}-${k}`)),
  ...keysIn('background-color').map((k) => `bg-${k}`),
  ...keysIn('border-color').map((k) => `border-${k}`),
  ...keysIn('text-color').map((k) => `text-${k}`),
  ...keysIn('text-decoration-color').map((k) => `decoration-${k}`),
  ...keysIn('outline-color').map((k) => `outline-${k}`),
]);
const oldClasses = PREFIXES.flatMap((p) => oldKeys.map((k) => `${p}-${k}`)).filter((c) => !newClasses.has(c));

const escape = (s: string) => s.replace(/[-]/g, '\\-');
const tokenRe = new RegExp(`(${oldTokens.map(escape).join('|')})(?![\\w-])`, 'g');
const classRe = new RegExp(`(?<![\\w-])(${oldClasses.map(escape).join('|')})(?![\\w-])`, 'g');

// dist/ is the built package (npm test builds it first). docs/ holds the migration guide, which
// lists the old names on purpose, and notes that say at the top they predate 1.0.
const SCAN = ['src', 'stories', '.storybook', 'visual', 'scripts', 'dist', 'docs', 'README.md', 'TOKENS.md'];
const SKIP = new Set(['docs/migration-1.0.md']);
const HISTORICAL = /^Historical note from /;
const EXT = /\.(css|ts|tsx|mdx|md|js|mjs|sh)$/;
function files(path: string): string[] {
  const full = join(root, path);
  if (statSync(full).isFile()) return [path];
  return readdirSync(full).flatMap((f) => (f.startsWith('.') && path !== '.storybook' ? [] : files(join(path, f)))).filter((f) => EXT.test(f));
}

// Bob 1.1 puts the type ramp in Tailwind's font-size namespace, so the theme declares
// --text-body and --text-prose again, as font-size keys that read --fs-*. Those lines are not 0.x
// colour tokens. Only the theme file may declare them, only as a key that reads the --fs-* token
// of the same name, and only alone on its line. Anything else, such as --text-body in
// tokens/colors.css or a var(--text-body), is still an old name.
const THEME_FILES = new Set(['src/tailwind/theme.css', 'dist/tailwind/theme.css']);
const FONT_SIZE_KEY = /^\s*--text-([a-z]+):\s*var\(--fs-\1\);\s*$/;

/** Every old name in a text, as `file:line name`. */
export function oldNames(file: string, text: string): string[] {
  const out: string[] = [];
  text.split('\n').forEach((line, i) => {
    if (THEME_FILES.has(file) && FONT_SIZE_KEY.test(line)) return;
    for (const re of [tokenRe, classRe]) for (const m of line.matchAll(re)) out.push(`${file}:${i + 1} ${m[1]}`);
  });
  return out;
}

describe('no 0.x colour name is left (DD-033)', () => {
  it('knows the old names', () => {
    expect(oldTokens).toContain('--text-2');
    expect(oldTokens).toContain('--color-surface-card');
    expect(oldTokens).not.toContain('--text-muted');
    expect(oldClasses).toContain('text-text-2');
    expect(oldClasses).toContain('bg-surface-card');
    expect(oldClasses).not.toContain('bg-card-hover');
    expect(oldNames('x', 'a { color: var(--text-2); } <b className="bg-panel">')).toEqual(['x:1 --text-2', 'x:1 bg-panel']);
    expect(oldNames('x', 'var(--text-primary) var(--bg-card) bg-card text-muted border-subtle')).toEqual([]);
    const theme = 'src/tailwind/theme.css';
    expect(oldNames(theme, '  --text-body: var(--fs-body);')).toEqual([]);
    expect(oldNames('src/tokens/colors.css', '  --text-body: var(--fs-body);')).toEqual([
      'src/tokens/colors.css:1 --text-body',
    ]);
    expect(oldNames(theme, '  --text-body: var(--fs-tiny);')).toEqual([`${theme}:1 --text-body`]);
    expect(oldNames(theme, '  --text-body: var(--fs-body); color: var(--text-2);')).toEqual([
      `${theme}:1 --text-body`,
      `${theme}:1 --text-2`,
    ]);
    expect(oldNames('x', 'a { color: var(--text-body); }')).toEqual(['x:1 --text-body']);
  });

  it('in src, stories, .storybook, visual, scripts, dist, docs, README and TOKENS.md', () => {
    const texts = SCAN.flatMap(files)
      .filter((f) => !SKIP.has(f))
      .map((f) => [f, readFileSync(join(root, f), 'utf8')] as const)
      .filter(([, text]) => !HISTORICAL.test(text));
    expect(texts.map(([f]) => f)).toContain('dist/tailwind/theme.css');
    const found = texts.flatMap(([f, text]) => oldNames(f, text));
    expect(found).toEqual([]);
  });
});
