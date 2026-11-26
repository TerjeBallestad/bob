// The axe check's configuration (visual/a11y.visual.ts): WCAG 2.2 AA, with 2.5.8 target size.
export const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

// The token pages show colour on purpose, failing pairs included (the contrast tables mark them).
// axe checks every other rule there, but not colour contrast.
export const NO_CONTRAST_CHECK = /^tokens--/;

// Known contrast failures. Fixing a colour value is design work: PLAN-005 TASK-035 (Task 6)
// does it, and then removes the entry here. Every failure that matches none of these fails the
// test. An entry matches a color-contrast node by the text colour axe measured (fg), and
// optionally the background (bg) or a class on the element or an ancestor (within).
export type Known = { why: string; fg: string; bg?: string; within?: string };
export const KNOWN_CONTRAST: Known[] = [
  // Found by Task 2 (TOKENS.md, TASK-031).
  { why: '--text-3 (gray-23) fails AA on every surface, 2.9 to 3.4', fg: '#62667a' },
  { why: '--text-4 (gray-22) fails AA on every surface, 2.0 to 2.3', fg: '#4a4e5e' },
  { why: 'Button danger: white on --danger, 3.9', fg: '#ffffff', bg: '#e5484d' },
  { why: 'Chip danger: --danger on --tint-danger, 4.1 to 4.4', fg: '#e5484d', within: 'chip-danger' },
  // Found by Task 3: a done ListRow is at opacity 0.55, so its text fails (2.5 to 2.8).
  { why: 'ListRow done: the row is at opacity 0.55', fg: '', within: 'list-row-done' },
];
