# Moving to Bob 1.2

Bob 1.2 is a minor version by Terje's choice (DD-038, SB-023). It is an exception to the semver
rule in README.md: some classes change their output and some are gone, which the rule would make
a major version. The next section lists each change an app sees with no edit. Read it first.

On purpose, an app then changes in four places:

1. **Type.** It writes one text style per element and drops the `leading-*`, `tracking-*` and
   `font-*` weight classes next to it. `text-doc` is now `text-display`.
2. **Radius.** Bob's theme clears Tailwind's radii. `rounded-md` is now 8px, not 6px.
3. **Raw values that Bob now has.** Shadows, the link hover colour and the row stop button.
4. **Buttons in a form.** Every Button is now `type="button"`. The one that submits says
   `type="submit"`.

Bump `@terjeballestad/bob` to `1.2.0`, then work through the sections below.

## Changes with no code edit

An app sees these as soon as it bumps the version.

**Gone.** These no longer build, and their theme variables are not written:

- `rounded-2xl`, `rounded-3xl`, `rounded-4xl`, and their side and corner forms (`rounded-t-2xl`,
  `rounded-tl-3xl`, ...). The theme variables `--radius-md` and `--radius-2xl` to `--radius-4xl`
  are gone too: `var(--radius-md)` in an app's CSS no longer resolves. Use `var(--radius)`.
- Tailwind's text sizes `text-xs`, `text-sm`, `text-lg`, `text-xl` to `text-9xl`, and their
  `--text-xs` to `--text-9xl` variables. Bob clears them as it clears Tailwind's colours and
  radii. `text-base` was already Bob's 13px.

**Changed.**

| Class | 1.1 | 1.2 |
| --- | --- | --- |
| `rounded`, `rounded-md` (and side forms) | Tailwind's 4px and 6px | Bob's 8px (`--radius`) |
| `text-micro` | font-size | Also line height `normal`, weight 700, letter spacing .05em |
| `text-prose` | font-size | Also line height 1.65 |
| `text-title` | font-size | Also line height 1.3, weight 700, letter spacing -.01em |
| `text-doc` | font-size | Also line height 1.3, weight 700, letter spacing -.01em. Deprecated: write `text-display` |
| `text-tiny`, `text-caption`, `text-body`, `text-base` | font-size | Also line height `normal` |
| `<Button>` of any variant | `type="submit"` (the native default), except `variant="text"` | `type="button"` |

- **Line heights.** In an app without Tailwind's preflight (pm-board and Makron), text had
  `normal` already, so the one-line styles move nothing. `text-prose`, `text-title` and
  `text-doc` do move: in Makron the sidebar brand (`text-prose`) grows from `normal` to 1.65 and
  pushes the nav down about 2px, and the first-run and login cards grow with `text-doc` (1.3) and
  `text-prose`. In an app **with** preflight (README's `@import "tailwindcss"`), the html line
  height is 1.5, so every `text-tiny`, `text-caption`, `text-body` and `text-base` line goes from
  1.5 to `normal`.
- **Weight and tracking.** A weight or tracking class on the same element still wins over the
  style (`text-title font-semibold` is 600). DD-038 asks an app to remove it.
- **Radius.** Makron's task picker option (`rounded-md`) goes from 6px to 8px, the radius of the
  picker around it. No edit is needed.
- **Buttons.** A form that relied on a Bob Button submitting it no longer submits. Neither
  pm-board nor Makron has one.

**Kept.** `text-doc` and `--fs-doc` work through 1.x as deprecated names of `text-display` and
`--fs-display`. `rounded-xs` (2px), `rounded-sm` (4px), `rounded-lg` (10px), `rounded-xl` (12px),
`rounded-btn`, `rounded-chip`, `rounded-kbd`, `rounded-none`, `rounded-full`, `tracking-heading`,
`tracking-label` and every colour class keep their values.

## Type: one text style per element

Each style sets the font size, the line height, and where it needs them the letter spacing and
the weight. TOKENS.md has the full table.

| Style | Sets | For |
| --- | --- | --- |
| `text-micro` | 9.5px, normal, .05em, 700 | Kind and priority tags, with `uppercase` |
| `text-tiny` | 10.5px, normal | Meta, counts, ages |
| `text-id` | 10.5px, normal, 600 | Ids and codes, with `font-mono` |
| `text-label` | 10.5px, normal, .08em, 600 | Section labels, column heads, with `uppercase` |
| `text-caption` | 11.5px, normal | One-line meta, hints |
| `text-note` | 11.5px, 1.5 | Small text that wraps |
| `text-body` | 12.5px, normal | Rows, cells, inputs |
| `text-subhead` | 12.5px, normal, 600 | A heading in a panel, a bar title |
| `text-base` | 13px, normal | Body default |
| `text-prose` | 13.5px, 1.65 | Document body |
| `text-heading` | 13.5px, normal, -.01em, 700 | Brand, column titles |
| `text-title` | 15px, 1.3, -.01em, 700 | Modal and panel titles |
| `text-headline` | 18px, 1.3, -.01em, 700 | Headings inside a document (markdown h1) |
| `text-display` | 21px, 1.3, -.01em, 700 | Page and document titles |

The rules:

- Write one style. Do not add a `leading-*`, `tracking-*` or font weight class next to it.
- A style cannot set case or family. A label adds `uppercase`; an id or a count adds `font-mono`.
  Those two are the only type classes an app writes next to a style.
- A size off the ramp moves to the nearest step, and a tie rounds up (DD-037). A weight, line
  height or tracking off the styles moves to the style for that role.
- Do not use Tailwind's line-height modifier (`text-title/7`): it drops the style's weight and
  letter spacing.

### Class renames

| 1.1 classes | 1.2 class | What moves |
| --- | --- | --- |
| `text-tiny font-semibold tracking-label uppercase` | `text-label uppercase` | Nothing |
| `font-mono text-tiny font-semibold` | `font-mono text-id` | Nothing |
| `text-caption leading-normal` | `text-note` | Nothing |
| `text-caption leading-relaxed` | `text-note` | Line height 1.625 to 1.5 |
| `text-caption leading-loose` | `text-note` | Line height 2 to 1.5 |
| `text-body font-semibold` | `text-subhead` | Nothing |
| `text-prose font-bold tracking-heading` | `text-heading` | Nothing |
| `text-prose font-semibold` | `text-heading` | Weight 600 to 700, tracking -.01em |
| `text-title font-semibold tracking-heading` | `text-title` | Weight 600 to 700, line height 1.3 |
| `text-doc` | `text-display` | Nothing (a new name) |
| `text-doc font-bold tracking-heading` | `text-display` | Line height normal to 1.3 |
| `text-micro font-semibold uppercase tracking-label` | `text-micro uppercase` | Weight 600 to 700, tracking .08em to .05em |

### Makron (client/src)

| File | 1.1 | 1.2 |
| --- | --- | --- |
| `OnboardingCard.tsx:35`, `Login.tsx:69` | `text-doc font-bold tracking-heading` | `text-display` |
| `OnboardingCard.tsx:39` | `text-prose font-semibold` | `text-heading` |
| `FirstRun.tsx:49`, `FirstRun.tsx:66` | `text-caption leading-normal` | `text-note` |
| `Login.tsx:88` | `text-caption leading-relaxed` | `text-note` |
| `SyntaxHint.tsx:14` | `text-caption leading-loose` | `text-note` (the Kbd keys fit in 17px lines) |
| `TopBar.tsx:19` | `text-body font-semibold` | `text-subhead` |
| `Sidebar.tsx:40` | `text-prose font-bold tracking-heading` | `text-heading` |
| `grid/TimeGrid.tsx:18` | `text-tiny font-semibold tracking-label … uppercase` | `text-label uppercase` |
| `grid/TaskCell.tsx:122`, `:151` | `font-mono text-tiny font-semibold` | `font-mono text-id` |

The other `text-tiny`, `text-caption`, `text-body` and `text-base` uses stay as they are. The CSS
Modules (settings, views) still hold raw sizes; they move with the rest of DD-037.

### pm-board (client/src/app.css)

pm-board's dashboard sets type in app.css rules, not classes, so 1.2 changes none of it. When
it moves to classes, each rule takes the style for its role. "Moves" lists what changes on
screen; a rule not named there keeps its look.

| Style | Rules |
| --- | --- |
| `text-micro uppercase` | `.pm-pcard-kind`, `.pm-frontier-tag` |
| `font-mono text-tiny` | `.pm-proj-progress`, `.pm-count`, `.pm-mono-dim`, `.pm-age`, `.pm-waitchip`, `.pm-meta-blocked`, `.pm-column-count`, `.pm-exec-id`, `.pm-claim`, `.pm-readonly`, `.pm-act-when`, `.pm-task-status` |
| `text-tiny` | `.pm-qo-kind` |
| `text-id` | `.pm-pcard-id`, `.pm-meta-priority`, `.pm-typechip`, `.pm-needs-row span` |
| `text-label uppercase` | `.pm-group-label`, `.pm-exec-label`, `.pm-needs-title` |
| `text-caption` | `.pm-act-line`, `.pm-exec-more`, `.pm-pacing`, `.pm-files`, `.md code`, `.md-entity-ref`, `.pm-task-verification pre`, `.pm-more`, `.pm-doclink`, `.pm-dimtext`, `.pm-hint`, `.pm-chip`, `.pm-dd-id`, `.pm-pcol-hint`, `.pm-chips-label`, `.pm-qo-id`, `.md-figure figcaption` |
| `text-note` | `.pm-outcome`, `.pm-act-text` |
| `text-body` | `.pm-mt-title`, `.pm-task-title`, `.pm-task-details`, `.pm-search-btn`, `.pm-topbar-sub`, `.pm-needs-row`, `.pm-empty-inline`, `.pm-check`, `.pm-exec-title`, `.pm-meta-item`, `.pm-test-claims`, `.md table` |
| `text-subhead` | `.pm-test-name`, `.pm-comment-author`, `.pm-context summary`, `.pm-slide-id`, `.pm-pcard-title` |
| `text-base` | `.pm-dd-title`, `.pm-signpost-note`, `.pm-undefined-note`, `.pm-qo-title`, `.pm-destination`, `.pm-strip-text`, `.pm-empty`, `.md h4`, `.pm-qo-input` |
| `text-prose` | `.md` |
| `text-heading` | `.pm-column-title`, `.pm-pcol-title`, `.pm-brand-name`, `.pm-topbar-title`, `.md h3` |
| `text-title` | `.pm-dd-featured-title`, `.md h2` |
| `text-headline` | `.md h1` |
| `text-display` | `.pm-home-title`, `.pm-doc-title` |

Moves:

| Rule | Today | With the style |
| --- | --- | --- |
| Sizes off the ramp | 10px (`.pm-readonly`, `.pm-act-when`, `.pm-task-status`); 11px (`.pm-needs-row span`, `.pm-more`, `.pm-doclink`, `.pm-dimtext`, `.pm-hint`, `.pm-chip`, `.pm-dd-id`, `.pm-pcol-hint`, `.pm-chips-label`, `.pm-qo-id`, `.md-figure figcaption`); 12px (`.pm-slide-id`, the `text-body` list after `.pm-task-details`); 14px (`.pm-brand-name`, `.pm-topbar-title`, `.pm-qo-input`, `.md h3`); 16px (`.md h2`); 22px (`.pm-home-title`, `.pm-doc-title`) | 10.5, 11.5, 12.5, 13.5 (13 for `.pm-qo-input`), 15 and 21px (DD-037; 10, 11 and 12 are ties and round up) |
| `.pm-pcard-title` | 13px, 600, line height 1.4 | 12.5px, 600, `normal` |
| `.pm-empty` | 13px, line height 1.8 | `normal` |
| `.pm-strip-text` | line height 1.5 | `normal` |
| `.pm-outcome` | line height 1.45 | 1.5 |
| `.md h3`, `.md h4` | line height 1.3 | `normal` (`.md h1` and `.md h2` keep 1.3) |
| `.pm-home-title` | `normal` (an h1 with no line height) | 1.3 |
| `.pm-doc-title` | 22px, 1.3 | 21px, 1.3 |
| `.pm-frontier-tag` | 9.5px, 700, .06em; not uppercased: the text is "FRONTIER" in the source | .05em. Add `uppercase`, or keep the capitals in the source |
| `.pm-needs-title` | 700, .06em | 600, .08em |
| `.pm-group-label`, `.pm-exec-label` | 700 | 600 |
| `.pm-column-title`, `.pm-pcol-title` | 13px, 700 | 13.5px, 700, -.01em |
| `.pm-brand-name`, `.pm-topbar-title`, `.md h3` | 14px, 700 (h3 bold by default) | 13.5px, -.01em |
| `.pm-dd-featured-title`, `.md h2` | no letter spacing; `.pm-dd-featured-title` `normal` line height | -.01em; 1.3 |
| `.pm-meta-priority`, `.pm-typechip` | sans, 600 | `text-id` sets no family: they stay sans |

`.pm-close` (20px) and `.pm-task-box` (10px) size a glyph, not text, and keep their values.

## Radius

Bob owns the scale (DD-038). A radius off the size steps (xs, sm, md, lg, xl) moves to the
nearest one, and a tie rounds up (DD-037). The role names (`btn`, `chip`, `kbd`) are for their
roles, not targets for a move.

| Class | Value | Use |
| --- | --- | --- |
| `rounded-xs` | 2px | Progress bars, swatches |
| `rounded-sm`, `rounded-kbd` | 4px | Small marks, Kbd, mono chip |
| `rounded-chip` | 5px | Chip, Select item |
| `rounded-btn` | 7px | Buttons, inputs, nav rows |
| `rounded-md`, `rounded` | 8px | Cards, rows, toasts, popups |
| `rounded-lg` | 10px | Featured cards |
| `rounded-xl` | 12px | Modals |

Uses whose value changes:

| App | Where | 1.1 | 1.2 |
| --- | --- | --- | --- |
| Makron | `grid/TaskCell.tsx:19` (picker option) | `rounded-md`, 6px | 8px with no edit: 6px is a tie between 4 and 8 and rounds up. It matches the picker's own radius |
| Makron | `grid/TaskCell.tsx:134` (picker) | `rounded-(--radius)` | `rounded-md` (8px, no change) |
| pm-board | `app.css` `.pm-task-box` | `border-radius: 3px` | `rounded-sm` (4px: a tie between 2 and 4, rounds up) |
| pm-board | `app.css` `.pm-logo`, `.pm-typechip` | `border-radius: 5px` | `rounded-chip` (5px, no change) |
| pm-board | `app.css` `.md code` | `border-radius: 4px` | `rounded-kbd` (4px, no change) |

No use in Bob changes value. pm-board's other radii read Bob's tokens (`var(--radius)`), which
keep their values.

## Shadows, colour and components

| Where | 1.1 | 1.2 |
| --- | --- | --- |
| Makron `Login.tsx:63`, `OnboardingCard.tsx:33` | `shadow-[0_28px_64px_-22px_rgba(0,0,0,0.75)]` | `shadow-panel` |
| Makron `grid/TaskCell.tsx:134` | `shadow-[0_12px_32px_rgba(0,0,0,0.45)]` | `shadow-popup` |
| Makron `app.css` `a:hover` | `color: #9aa1f0` | `color: var(--indigo-10)` |
| Makron `grid/EntryRow.tsx:77` | `<button className="hidden cursor-pointer rounded-kbd border-none bg-danger-tint px-1.5 py-px font-mono text-tiny text-danger group-hover/row:inline">` | `<Button variant="danger-tint" size="xs" className="hidden font-mono group-hover/row:inline">` |
| pm-board `app.css` `.pm-qo` | `box-shadow: var(--shadow-modal)` | `shadow-modal`, when it moves to classes |
| pm-board `app.css` `.pm-slide` | `box-shadow: var(--shadow-overlay)` | `shadow-overlay`, when it moves to classes |

- The stop button's text is `--text-danger-soft` (red 11), not `--text-danger` (red 9): red 9 on
  the tint is 4.1:1, under AA. Its weight is 500, as Bob's other quiet buttons.
- `shadow-toast`, `shadow-modal` and `shadow-overlay` are classes for Bob's existing shadows.
- The brand text shadow on Makron's login and onboarding cards has no Bob class yet.
- Every `Button` is `type="button"` unless it sets `type`. A Button that submits a form says
  `type="submit"`.
- `size="xs"` is about 16px high, under WCAG 2.2's 24px target. The design pass decides.
- `Modal` and `SectionLabel` take `className`. It goes on the modal box and on the label, after
  Bob's class, so `<Modal className="w-[720px]">` replaces `style={{ width: 720 }}`.
