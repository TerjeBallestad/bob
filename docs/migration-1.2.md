# Moving to Bob 1.2

Bob 1.2 is a minor version (DD-038). Every 1.1 class name still works, and Bob's components look
as they did. An app changes in three places on purpose:

1. **Type.** It writes one text style per element and drops the `leading-*`, `tracking-*` and
   `font-*` weight classes next to it.
2. **Radius.** Bob's theme clears Tailwind's radii. `rounded-md` is now 8px, not 6px.
3. **Raw values that Bob now has.** Shadows, the link hover colour and the row stop button.

Bump `@terjeballestad/bob` to `1.2.0`, then work through the sections below.

## What can move on its own

Read this first: these are the changes an app sees before it edits a line.

| Class | 1.1 | 1.2 |
| --- | --- | --- |
| `rounded-md` | Tailwind's 6px | Bob's 8px (`--radius`) |
| `rounded` | Tailwind's 4px | Bob's 8px (`--radius`) |
| `rounded-2xl`, `rounded-3xl`, `rounded-4xl` | Tailwind's 16, 24, 32px | Gone: no class is built |
| `text-micro` | font-size | Also weight 700, letter spacing .05em |
| `text-prose` | font-size | Also line height 1.65 |
| `text-title` | font-size | Also line height 1.3, weight 700, letter spacing -.01em |
| `text-doc` | font-size | Also line height 1.3, weight 700, letter spacing -.01em |
| `text-tiny`, `text-caption`, `text-body`, `text-base` | font-size | Also line height `normal` |

- `rounded-xs` (2px), `rounded-sm` (4px), `rounded-lg` (10px), `rounded-xl` (12px),
  `rounded-btn`, `rounded-chip`, `rounded-kbd`, `rounded-none` and `rounded-full` keep their values.
- `normal` is what text in pm-board and Makron has today: neither app loads Tailwind's preflight.
  Text inside an element with its own line height (a `.md` block at 1.65) now gets `normal`.
- A weight or tracking class on the same element still wins over the style (`text-title
  font-semibold` is 600). That is how 1.1 code keeps working. DD-038 asks an app to remove it.
- `tracking-heading` and `tracking-label` stay. Every other Tailwind class keeps its value.

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
| `text-doc` | 21px, 1.3, -.01em, 700 | Page and document titles |

The rules:

- Write one style. Do not add a `leading-*`, `tracking-*` or font weight class next to it.
- A style cannot set case or family. A label adds `uppercase`; an id or a count adds `font-mono`.
  Those two are the only type classes an app writes next to a style.
- A size off the ramp moves to the nearest step (DD-037). A weight, line height or tracking off
  the styles moves to the style for that role.

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
| `text-doc font-bold tracking-heading` | `text-doc` | Line height normal to 1.3 |
| `text-micro font-semibold uppercase tracking-label` | `text-micro uppercase` | Weight 600 to 700, tracking .08em to .05em |

### Makron (client/src)

| File | 1.1 | 1.2 |
| --- | --- | --- |
| `OnboardingCard.tsx:35`, `Login.tsx:69` | `text-doc font-bold tracking-heading` | `text-doc` |
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
it moves to classes, each rule takes the style for its role:

| Style | Rules |
| --- | --- |
| `text-micro uppercase` | `.pm-pcard-kind`, `.pm-frontier-tag` |
| `font-mono text-tiny` | `.pm-proj-progress`, `.pm-count`, `.pm-mono-dim`, `.pm-age`, `.pm-waitchip`, `.pm-meta-blocked`, `.pm-column-count`, `.pm-exec-id`, `.pm-claim`; from 10px: `.pm-readonly`, `.pm-act-when`, `.pm-task-status` |
| `text-tiny` | `.pm-qo-kind` |
| `text-id` | `.pm-pcard-id`, `.pm-meta-priority`, `.pm-typechip`, `.pm-needs-row span` (11px) |
| `text-label uppercase` | `.pm-group-label`, `.pm-exec-label`, `.pm-needs-title` (all 700 today; the style is 600) |
| `text-caption` | `.pm-act-line`, `.pm-exec-more`, `.pm-pacing`, `.pm-files`, `.md code`, `.md-entity-ref`, `.pm-task-verification pre`; from 11px: `.pm-more`, `.pm-doclink`, `.pm-dimtext`, `.pm-hint`, `.pm-chip`, `.pm-dd-id`, `.pm-pcol-hint`, `.pm-chips-label`, `.pm-qo-id`, `.md-figure figcaption` |
| `text-note` | `.pm-outcome` (1.45 today), `.pm-act-text` |
| `text-body` | `.pm-mt-title`, `.pm-task-title`, `.pm-task-details`; from 12px: `.pm-search-btn`, `.pm-topbar-sub`, `.pm-needs-row`, `.pm-empty-inline`, `.pm-check`, `.pm-exec-title`, `.pm-meta-item`, `.pm-test-claims`, `.md table` |
| `text-subhead` | `.pm-test-name`, `.pm-comment-author`, `.pm-context summary`, `.pm-slide-id` (12px), `.pm-pcard-title` (13px, 600) |
| `text-base` | `.pm-dd-title`, `.pm-signpost-note`, `.pm-undefined-note`, `.pm-qo-title`, `.pm-destination`, `.pm-strip-text`, `.pm-empty`, `.md h4`; from 14px: `.pm-qo-input` |
| `text-prose` | `.md` |
| `text-heading` | `.pm-column-title`, `.pm-pcol-title` (13px); from 14px: `.pm-brand-name`, `.pm-topbar-title`, `.md h3` |
| `text-title` | `.pm-dd-featured-title`; from 16px: `.md h2` |
| `text-doc` | from 22px: `.pm-home-title`, `.pm-doc-title`; from 18px: `.md h1` (a tie, so it rounds up) |

`.pm-close` (20px) and `.pm-task-box` (10px) size a glyph, not text, and keep their values.

## Radius

Bob owns the scale (DD-038). A radius off it moves to the nearest step.

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
| Makron | `grid/TaskCell.tsx:19` (picker option) | `rounded-md`, 6px | Becomes 8px. Write `rounded-chip` (5px, the nearest step, as Bob's Select item) |
| Makron | `grid/TaskCell.tsx:134` (picker) | `rounded-(--radius)` | `rounded-md` (8px, no change) |
| pm-board | `app.css` `.pm-task-box` | `border-radius: 3px` | `var(--radius-sm)` (4px), when it moves to tokens |

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
- `Modal` and `SectionLabel` take `className`. It goes on the modal box and on the label, after
  Bob's class, so `<Modal className="w-[720px]">` replaces `style={{ width: 720 }}`.
