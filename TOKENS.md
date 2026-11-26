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
that does not end at a step, and on a 0.2.0 token whose value changed. The scales are kept by hand
(DD-032). DD-033 proposes new role names for Tailwind; until it is accepted, the names below stay.

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

Also `--white` `#ffffff`, `--black-a40` / `-a50` / `-a55` (shadows) and `--gray-1-a55` (the scrim).
Some steps have no role yet: components use those values raw, and Task 1 moves them onto roles.

### Roles

Surfaces. Depth comes from 1px borders, never elevation; hover moves one step up.

| Role | Step | Use |
| --- | --- | --- |
| `--surface-code` | gray-2 | Code blocks |
| `--bg` = `--surface-app` | gray-3 | App background |
| `--bg-rail` = `--surface-rail` | gray-4 | Right rail |
| `--bg-side` = `--surface-sidebar` | gray-5 | Sidebar |
| `--surface-overlay` | gray-6 | Slide-over |
| `--panel-dim` | gray-7 | Recessed panels |
| `--panel` = `--surface-card` | gray-8 | Cards, raised rows |
| `--surface-modal` | gray-9 | Modal |
| `--input` = `--surface-input` | gray-11 | Input, select, textarea fill |
| `--panel-hover` = `--surface-card-hover` | gray-12 | Hover/selected fill |
| `--surface-toast` | gray-13 | Toast |

Borders: `--border` gray-14 (default hairline) · `--input-border` gray-15 (inputs; also the
progress track and `Kbd` fill) · `--border-2` gray-16 (buttons, modals) · `--border-card-hover`
gray-18.

Text. De-emphasis is a step down or opacity (.55–.85), never a hue change. Disabled is `opacity: .5`.

| Role | Step | Use |
| --- | --- | --- |
| `--text` = `--text-body` | gray-26 | Primary |
| `--text-prose` | gray-25 | Long-form document body |
| `--text-2` = `--text-secondary` | gray-24 | Secondary, button labels |
| `--text-3` = `--text-muted` | gray-23 | Section labels, placeholders |
| `--text-4` = `--text-faint` | gray-22 | Timestamps, ages |
| `--on-accent` | gray-3 | Text on an `--accent` fill |

Accent and status. Colour carries meaning, not decoration; it shows mostly as a tint behind small text.

| Role | Step | Meaning |
| --- | --- | --- |
| `--accent` | indigo-9 | The single brand indigo |
| `--accent-deep` | indigo-8 | Focus border, `accent` button fill |
| `--blue` | blue-9 | Docs, references |
| `--green` | green-9 | Done, plans, live agents |
| `--orange` | orange-9 | Blocked, warnings |
| `--purple` | purple-9 | Probe |
| `--yellow` | yellow-9 | Gap |
| `--danger` | red-9 | Destructive |
| `--gold` | gold-9 | Human avatar |

Tints: `--tint-accent` indigo-9-a10 · `--tint-blue` blue-9-a8 · `--tint-green` green-9-a10 ·
`--tint-orange` orange-9-a9 · `--tint-danger` red-9-a12 · `--tint-yellow` yellow-9-a10.
`--scrim` gray-1-a55 is the modal backdrop (no `backdrop-filter`).

### Contrast

WCAG 2.2, computed from the tokens; a tint is painted over its card first. AA asks 4.5:1. Bob's
text is under 18px, so the 3:1 large-text limit does not apply. The token test checks these findings.

- `--text`, `--text-prose` and `--text-2` pass AA on every surface (`--text-2`: 6.2 on
  `--surface-toast` to 7.3 on `--surface-code`).
- `--text-3` fails AA on every surface (2.9 to 3.4). `--text-4` fails on every surface (2.0 to 2.3).
  The design pass decides each use: lift the colour, or accept the text as decorative.
- Pairs in use that fail AA: white on `--danger` (Button danger, 3.9) and `--danger` on
  `--tint-danger` (Chip danger, 4.1). All other pairs pass: Button primary 5.7, Chip accent 4.8,
  Button accent 6.2, the rest above 6.

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
Tracking `--ls-heading` `-.01em` (headings) · `--ls-label` `.08em` (uppercase section labels).

## Layout — `tokens/layout.css`

Radii: `--radius-kbd` 4px (chips/kbd) · `--radius-chip` 5px · `--radius-btn` 7px
(buttons, inputs, nav rows) · `--radius` 8px (cards) · `--radius-lg` 10px (featured) ·
`--radius-xl` 12px (modals). Dots are circles; swatches are 2px squares.

Shadows only on floating layers: `--shadow-modal` `0 24px 60px` black-a50 ·
`--shadow-overlay` `-24px 0 60px` black-a55 · `--shadow-toast` `0 8px 24px` black-a40.
Emphasis rings: `--glow-accent` `0 0 0 1px` indigo-9-a12 · `--glow-green` `0 0 6px` green-9-a70.

Space: Bob has no spacing tokens yet. The Tokens page shows the padding, margin and gap values the
components use today.

Structure: `--sidebar-w` 226px · `--rail-w` 290px · `--topbar-h` 48px.

Motion: `--dur-fast` .1s · `--dur` .12s · `--dur-slow` .18s, all `--ease` `ease`. Fast and small — nothing bounces.

## Base styles and focus — `tokens/base.css`

Carries the reset, `body` defaults, the link and scrollbar styling, and the one focus style:
on keyboard focus (`:focus-visible`) every control gets a `--focus-ring-width` (2px) ring in
`--accent`, `--focus-ring-offset` (2px) outside it. SegToggle draws it inside, because it clips.

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
replace Tailwind's own `animate-pulse` keyframe in an app. Storybook's Animations / Live dot
story shows it next to Tailwind's `animate-pulse` and `animate-ping`.

## Fonts — `tokens/fonts.css`

Schibsted Grotesk and JetBrains Mono load from the Google Fonts CDN, matching the source app.
No font binaries ship with the system. If the app must work offline, self-host and replace this file —
the `--sans` / `--mono` tokens are the only thing components depend on.
