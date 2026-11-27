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

const SCAN = ['src', 'stories', '.storybook', 'README.md', 'TOKENS.md'];
const EXT = /\.(css|ts|tsx|mdx|md|js|mjs)$/;
function files(path: string): string[] {
  const full = join(root, path);
  if (statSync(full).isFile()) return [path];
  return readdirSync(full).flatMap((f) => (f.startsWith('.') && path !== '.storybook' ? [] : files(join(path, f)))).filter((f) => EXT.test(f));
}

/** Every old name in a text, as `file:line name`. */
export function oldNames(file: string, text: string): string[] {
  const out: string[] = [];
  text.split('\n').forEach((line, i) => {
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
  });

  it('in src, stories, .storybook, README and TOKENS.md', () => {
    const found = SCAN.flatMap(files).flatMap((f) => oldNames(f, readFileSync(join(root, f), 'utf8')));
    expect(found).toEqual([]);
  });
});
