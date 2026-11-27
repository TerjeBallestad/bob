# Design tokens

Every token is a CSS custom property on `:root`, declared in `src/tokens/*.css` and pulled in by
`src/styles.css` (which `index.ts` imports). Each component's CSS Module reads them as
`var(--name)`. There is no theme switcher: **one dark theme only.**

Values were extracted verbatim from the source dashboard design bundle (not part of this repo).
The Tokens page in Storybook shows every token, computed from these files.

## Colours — `tokens/colors.css`

Colour has two layers. The Tokens page in Storybook shows both, computed from the CSS.

- A **scale** holds the values. A step is `--<scale>-<n>`. An alpha step is `--<scale>-<n>-a<percent>`,
  the solid step at that opacity: `--indigo-9-a10` is indigo 9 at 10%.
- A **role** says what a colour is for and points at a step. Components use roles, never steps.

Only scale steps hold colour literals. `test/tokens.test.ts` fails on a literal anywhere else, on a role
that does not end at a step, and on a 1.0 role whose value differs from the 0.x role it replaces.
The scales are kept by hand (DD-032). Bob 1.0 renamed every role (DD-033); docs/migration-1.0.md
lists each 0.x name and its new one.

### Scales

**gray**, 26 steps, dark to light. 1–13 surfaces, 14–21 borders, 22–26 text. Some steps differ by
one level in one channel (gray 6 and 7). They stay apart so that no pixel moves; the design pass
merges them.

| Step | Value | Step | Value | Step | Value |
| --- | --- | --- | --- | --- | --- |
| 1 | `#050609` | 10 | `#16181f` | 19 | `#33374a` |
| 2 | `#0d0e12` | 11 | `#191b21` | 20 | `#333849` |
| 3 | `#0f1014` | 12 | `#1b1d24` | 21 | `#3b3e4d` |
| 4 | `#111218` | 13 | `#1d1f27` | 22 | `#4a4e5e` |
| 5 | `#121318` | 14 | `#1f222b` | 23 | `#62667a` |
| 6 | `#131419` | 15 | `#22252f` | 24 | `#9b9fad` |
| 7 | `#13141a` | 16 | `#262933` | 25 | `#c9cbd4` |
| 8 | `#15161b` | 17 | `#2b2f3d` | 26 | `#e6e7ec` |
| 9 | `#16171d` | 18 | `#2e3342` | | |

**Hues** use the 12 steps of Radix Colors: 1–2 backgrounds, 3–5 fills, 6–8 borders, 9 the solid,
10 its hover, 11 low-contrast text, 12 high-contrast text. Bob fills only the steps it uses.

| Scale | Solid steps | Alpha steps |
| --- | --- | --- |
| indigo | 6 `#2a2d52` · 8 `#4c56c0` · 9 `#7b83eb` | 9-a10 · 9-a12 · 9-a18 |
| blue | 9 `#52a9ff` | 9-a8 |
| green | 6 `#1f4436` · 9 `#46c288` | 9-a10 · 9-a18 · 9-a70 |
| orange | 9 `#f0883e` | 9-a9 · 9-a30 |
| purple | 9 `#c084fc` | 9-a28 |
| yellow | 9 `#e2c541` · 11 `#e6db74` | 9-a10 · 11-a10 |
| red | 9 `#e5484d` · 11 `#d47f82` · 12 `#f4a6a8` | 9-a12 · 9-a40 · 9-a50 |
| gold | 9 `#d3b078` | 9-a18 |

Also `--white` `#ffffff`, `--black-a40` / `-a45` / `-a50` / `-a55` / `-a75` (shadows) and `--gray-1-a55` (the scrim).
In Tailwind, a step is a class with every colour utility: `bg-gray-3`, `text-indigo-9`,
`border-red-9-a40`. Bob's theme clears Tailwind's default palette, so `gray-500` does not exist.

### Roles

Each role is one token, named like its Tailwind class (DD-033): `--bg-card` is `bg-card`,
`--text-primary` is `text-primary`. A role is for one property, so it makes one class: there is
no `text-card` and no `bg-primary`. A CSS rule or an inline style reads `var(--bg-card)`.

Backgrounds, `bg-*`. Depth comes from 1px borders, never elevation; hover moves one step up.

| Role | Step | Use |
| --- | --- | --- |
| `--bg-sunken` | gray-2 | Code blocks |
| `--bg-app` | gray-3 | App background |
| `--bg-rail` | gray-4 | Right rail |
| `--bg-sidebar` | gray-5 | Sidebar |
| `--bg-overlay` | gray-6 | Slide-over |
| `--bg-card-dim` | gray-7 | Recessed panels |
| `--bg-card` | gray-8 | Cards, raised rows |
| `--bg-modal` | gray-9 | Modal, Select list |
| `--bg-nav-hover` | gray-10 | NavRow hover |
| `--bg-input` | gray-11 | Input, Select trigger, Textarea fill |
| `--bg-card-hover` | gray-12 | Hover/selected fill |
| `--bg-toast` | gray-13 | Toast |
| `--bg-fill` | gray-15 | Kbd, progress track, neutral Avatar |
| `--bg-accent` | indigo-9 | Primary button, accent fills |
| `--bg-accent-strong` | indigo-8 | Accent button |
| `--bg-danger` | red-9 | Danger button |
| `--bg-green` | green-9 | Live dot, progress fill |
| `--bg-scrim` | gray-1-a55 | Modal backdrop (no `backdrop-filter`) |

Tints, `bg-*-tint`: `--bg-accent-tint` indigo-9-a10 · `--bg-accent-tint-strong` indigo-9-a18 ·
`--bg-blue-tint` blue-9-a8 · `--bg-green-tint` green-9-a10 · `--bg-green-tint-strong` green-9-a18 ·
`--bg-orange-tint` orange-9-a9 · `--bg-danger-tint` red-9-a12 · `--bg-yellow-tint` yellow-9-a10 ·
`--bg-claim-tint` yellow-11-a10 · `--bg-gold-tint` gold-9-a18.

Borders, `border-*`:

| Role | Step | Use |
| --- | --- | --- |
| `--border-subtle` | gray-14 | Default hairline |
| `--border-input` | gray-15 | Inputs, secondary button |
| `--border-strong` | gray-16 | Buttons, modals, toasts |
| `--border-input-focus` | gray-17 | SearchInput key hint hover |
| `--border-card-hover` | gray-18 | TicketCard hover |
| `--border-strong-hover` | gray-20 | Ghost button hover |
| `--border-focus` | indigo-8 | Focused field |
| `--border-invalid` | red-9 | Field with `aria-invalid` |
| `--border-accent-subtle` | indigo-6 | TicketCard `sdd` |
| `--border-green-subtle` | green-6 | TicketCard `plan` |
| `--border-orange-subtle` | orange-9-a30 | TicketCard grill |
| `--border-purple-subtle` | purple-9-a28 | TicketCard probe |
| `--border-danger-subtle` | red-9-a40 | Danger-ghost button hover |
| `--border-danger` | red-9-a50 | Error toast |

Text, `text-*`. De-emphasis is a step down or opacity (.55–.85), never a hue change. Disabled is
`opacity: .5`.

| Role | Step | Use |
| --- | --- | --- |
| `--text-primary` | gray-26 | Primary |
| `--text-reading` | gray-25 | Long-form document body |
| `--text-secondary` | gray-24 | Secondary, button labels |
| `--text-muted` | gray-23 | Section labels, placeholders |
| `--text-faint` | gray-22 | Timestamps, ages |
| `--text-on-accent` | gray-3 | Text on `--bg-accent` |
| `--text-on-solid` | white | Text on `--bg-accent-strong` and `--bg-danger` |
| `--text-accent` | indigo-9 | The single brand indigo |
| `--text-blue` | blue-9 | Docs, references |
| `--text-green` | green-9 | Done, plans, live agents |
| `--text-orange` | orange-9 | Blocked, warnings |
| `--text-purple` | purple-9 | Probe |
| `--text-yellow` | yellow-9 | Gap |
| `--text-gold` | gold-9 | Human avatar |
| `--text-danger` | red-9 | Destructive |
| `--text-danger-soft` | red-11 | Danger-ghost button |
| `--text-danger-strong` | red-12 | Error toast |
| `--text-claim` | yellow-11 | Claim chip |

Also `--decoration-strike` gray-21 (`decoration-strike`, the line through a done ListRow) and
`--outline-focus` indigo-9 (`outline-focus`, the keyboard focus ring).

The text keys are never Tailwind font-size keys (`sm`, `base`, `lg`, ...): a key in both
namespaces loses its font size. For that reason the reading colour is `reading`, not `prose`.

### Contrast

WCAG 2.2, computed from the tokens; a tint is painted over its card first. AA asks 4.5:1. Bob's
text is under 18px, so the 3:1 large-text limit does not apply. The token test checks these findings.

- `--text-primary`, `--text-reading` and `--text-secondary` pass AA on every surface
  (`--text-secondary`: 6.2 on `--bg-toast` to 7.3 on `--bg-sunken`).
- `--text-muted` fails AA on every surface (2.9 to 3.4). `--text-faint` fails on every surface
  (2.0 to 2.3). The design pass decides each use: lift the colour, or accept the text as decorative.
- Pairs in use that fail AA: `--text-on-solid` on `--bg-danger` (Button danger, 3.9) and
  `--text-danger` on `--bg-danger-tint` (Chip danger, 4.1). All other pairs pass: Button primary
  5.7, Chip accent 4.8, Button accent 6.2, the rest above 6.

## Typography — `tokens/typography.css`

| Token                    | Value                                        |
| ------------------------ | -------------------------------------------- |
| `--sans` / `--font-sans` | `'Schibsted Grotesk', system-ui, sans-serif` |
| `--mono` / `--font-mono` | `'JetBrains Mono', ui-monospace, monospace`  |

Mono is for identity and measurement — ids, counts, timestamps, durations, `kbd`. Everything else is sans.

Size ramp (exact odd values are intentional; there is no modular scale):

| Token          | Value    | Use                              |
| -------------- | -------- | -------------------------------- |
| `--fs-micro`   | `9.5px`  | Kind/priority labels             |
| `--fs-tiny`    | `10.5px` | Mono ids, counts, section labels |
| `--fs-caption` | `11.5px` | Meta rows, activity lines        |
| `--fs-body`    | `12.5px` | Card titles, rows, inputs        |
| `--fs-base`    | `13px`   | Body default                     |
| `--fs-prose`   | `13.5px` | Document body                    |
| `--fs-title`   | `15px`   | Modal/featured headings          |
| `--fs-doc`     | `21px`   | Slide-over document title        |

Weights `--fw-regular` 400 · `--fw-medium` 500 · `--fw-semibold` 600 · `--fw-bold` 700.
Tracking `--ls-heading` `-.01em` (headings) · `--ls-label` `.08em` (uppercase section labels) ·
`--ls-tag` `.05em` (uppercase kind and priority tags).
Line heights, for text that wraps: `--lh-heading` 1.3 · `--lh-note` 1.5 · `--lh-prose` 1.65.
One-line text keeps the font's own line height (`normal`).

### Text styles

In Tailwind (`tailwind/theme.css`), Bob's type is a set of text styles (DD-038). One class sets
the font size, the line height, and where the style needs them the letter spacing and the
weight. An app writes `text-label`, not `text-tiny font-semibold tracking-label`, and adds no
`leading-*`, `tracking-*` or font weight next to a style.

| Class          | Size   | Line height | Tracking | Weight | Use                                 |
| -------------- | ------ | ----------- | -------- | ------ | ----------------------------------- |
| `text-micro`   | 9.5px  | normal      | .05em    | 700    | Kind and priority tags, `uppercase` |
| `text-tiny`    | 10.5px | normal      |          |        | Meta, counts, ages                  |
| `text-id`      | 10.5px | normal      |          | 600    | Ids and codes, with `font-mono`     |
| `text-label`   | 10.5px | normal      | .08em    | 600    | Section labels, column heads, `uppercase` |
| `text-caption` | 11.5px | normal      |          |        | One-line meta, hints                |
| `text-note`    | 11.5px | 1.5         |          |        | Small text that wraps               |
| `text-body`    | 12.5px | normal      |          |        | Rows, cells, inputs                 |
| `text-subhead` | 12.5px | normal      |          | 600    | A heading in a panel, a bar title   |
| `text-base`    | 13px   | normal      |          |        | Body default                        |
| `text-prose`   | 13.5px | 1.65        |          |        | Document body                       |
| `text-heading` | 13.5px | normal      | -.01em   | 700    | Brand, column titles                |
| `text-title`   | 15px   | 1.3         | -.01em   | 700    | Modal and panel titles              |
| `text-doc`     | 21px   | 1.3         | -.01em   | 700    | Page and document titles            |

- The ramp names are each size's plain style. A size that needs a second style gets a role
  name: `text-id` and `text-label` at 10.5px, `text-note` at 11.5px, `text-subhead` at 12.5px,
  `text-heading` at 13.5px.
- A style with no weight takes its parent's weight, so `text-tiny` in a bold row stays bold.
- A style sets no case and no family: Tailwind's text styles cannot. A label adds `uppercase`,
  an id or a count adds `font-mono`. `SectionLabel` renders the label style with its case.
- `text-base` is `--fs-base` (13px), not Tailwind's 1rem; Tailwind's `text-xs` to `text-9xl`
  keep their values. `tracking-heading` and `tracking-label` stay from 1.1.
- Bob's components keep their own CSS. Some sizes in it are not on the ramp (10px mono in Kbd
  and the mono chip, 12px in Button md and SearchInput); the design pass moves them.

## Layout — `tokens/layout.css`

Radius. Bob owns the scale (DD-038): its theme clears Tailwind's radii, so each `rounded-*` class
is Bob's. Five size steps, and three role names for the sizes between them:

| Class | Token | Value | Use |
| --- | --- | --- | --- |
| `rounded-xs` | `--radius-xs` | 2px | Progress bars, swatches |
| `rounded-sm` | `--radius-sm` | 4px | Small marks |
| `rounded-kbd` | `--radius-kbd` | 4px (`--radius-sm`) | Kbd, mono chip |
| `rounded-chip` | `--radius-chip` | 5px | Chip, Select item |
| `rounded-btn` | `--radius-btn` | 7px | Buttons, inputs, nav rows |
| `rounded-md`, `rounded` | `--radius` | 8px | Cards, rows, toasts |
| `rounded-lg` | `--radius-lg` | 10px | Featured cards |
| `rounded-xl` | `--radius-xl` | 12px | Modals |

`rounded-none` and `rounded-full` (dots) stay. `rounded-2xl` to `rounded-4xl` do not exist. A
radius off the steps moves to the nearest one, as a size does (DD-037): 3px and 6px move to
`rounded-sm` and `rounded-chip`.

Shadows only on floating layers. Each is a Tailwind class of the same name (`shadow-modal`):

| Token | Value | Use |
| --- | --- | --- |
| `--shadow-toast` | `0 8px 24px` black-a40 | Toast, Select list |
| `--shadow-popup` | `0 12px 32px` black-a45 | A list that drops from a field (Makron's task picker) |
| `--shadow-modal` | `0 24px 60px` black-a50 | Modal |
| `--shadow-overlay` | `-24px 0 60px` black-a55 | Slide-over |
| `--shadow-panel` | `0 28px 64px -22px` black-a75 | A panel alone over a picture (Makron's login card) |

Tailwind's `shadow-sm` to `shadow-2xl` stay; Bob's components do not use them.
Emphasis rings: `--glow-accent` `0 0 0 1px` indigo-9-a12 · `--glow-green` `0 0 6px` green-9-a70.

Space: Bob has no spacing tokens yet. The Tokens page shows the padding, margin and gap values the
components use today.

Structure: `--sidebar-w` 226px · `--rail-w` 290px · `--topbar-h` 48px.

Motion: `--dur-fast` .1s · `--dur` .12s · `--dur-slow` .18s, all `--ease` `ease`. Fast and small — nothing bounces.

## Base styles and focus — `tokens/base.css`

Carries the reset, `body` defaults, the link and scrollbar styling, and the one focus style:
on keyboard focus (`:focus-visible`) every control gets a `--focus-ring-width` (2px) ring in
`--outline-focus`, `--focus-ring-offset` (2px) outside it. SegToggle draws it inside, because it clips.

## Animations — `tailwind/theme.css`

Four Tailwind theme keys, each with its keyframe. A Tailwind app writes the class; a build
writes the keyframe only when something uses it. Bob's components run them only under
`motion-safe` (the user has not asked for reduced motion).

| Theme key            | Class              | Value                                   | Used by                                     |
| -------------------- | ------------------ | --------------------------------------- | ------------------------------------------- |
| `--animate-live`     | `animate-live`     | `live-pulse` 1.8s ease-in-out, infinite | `StatusDot state="live"`, `TicketCard live` |
| `--animate-toast-in` | `animate-toast-in` | `toast-in` 0.18s ease                   | `Toast`                                     |
| `--animate-card-in`  | `animate-card-in`  | `card-in` 0.18s ease                    | Staggered card entry (not used by Bob)      |
| `--animate-slide-in` | `animate-slide-in` | `slide-in` 0.18s ease                   | Slide-over panels (not used by Bob)         |

`live-pulse` was named `pulse` up to 0.3.0. It is not named `pulse` any more, so it does not
replace Tailwind's own `animate-pulse` keyframe in an app. Storybook's Foundations / Animations / Live dot
story shows it next to Tailwind's `animate-pulse` and `animate-ping`.

## Fonts — `tokens/fonts.css`

Schibsted Grotesk and JetBrains Mono load from the Google Fonts CDN, matching the source app.
No font binaries ship with the system. If the app must work offline, self-host and replace this file —
the `--sans` / `--mono` tokens are the only thing components depend on.
