# Migrating to Bob 1.0

Bob 1.0 is a major version. An app moves to it once. This guide covers three changes:

1. The colour roles get their DD-033 names (PLAN-005 Task 6, TASK-037). This section is done.
2. Select moves onto Base UI, with Base UI's API (DD-036, Task 7, TASK-041). Its section waits for Task 7.
3. Toast moves onto Base UI's toast manager (DD-036, Task 7). Its section waits for Task 7.

## Colour roles (DD-033)

### What changed

- **Each role is one token, named like its Tailwind class.** `--bg-card` is `bg-card`,
  `--text-primary` is `text-primary`, `--border-subtle` is `border-subtle`.
- **A role is for one property.** `--bg-*` is a background, `--border-*` a border colour, `--text-*`
  a text colour. Tailwind makes `bg-card` but no `text-card` or `border-card`.
- **The 0.x names are gone.** Bob 1.0 keeps no alias. `--bg`, `--panel`, `--surface-*`, `--text-2`,
  `--tint-*` and the others no longer exist. A `var()` of an old name resolves to nothing, and the
  property falls back to its initial value: no error, but the colour is lost.
- **Two names became one.** 0.x had two names for many roles (`--bg` and `--surface-app`). Both map
  to the one new token.
- **One name became several.** A 0.x role that served two properties has one token per property.
  `--accent` is `--text-accent` as a text colour and `--bg-accent` as a fill. Pick by the property
  that reads it.
- **Scales are Tailwind colours.** Every scale step is a `--color-*` key, so a one-off works with
  every utility: `bg-gray-3`, `text-indigo-9`, `border-red-9-a40`, `text-white`.
- **Tailwind's default palette is cleared** (`--color-*: initial`). `gray-500`, `blue-600`, `black`
  and the other default colours no longer exist in an app that imports Bob's Tailwind entry.
  `bg-transparent` and `text-current` still work.
- **No value changed.** Each new token holds the exact value of the 0.x role it replaces
  (test/tokens.test.ts). A rename changes no pixel.

### Tokens

Find the old name in the left column. Where it lists several new names, choose by the CSS property.

| 0.x token | 1.0 token | Use it for |
| --- | --- | --- |
| `--bg`, `--surface-app` | `--bg-app` | background |
| `--bg-side`, `--surface-sidebar` | `--bg-sidebar` | background |
| `--bg-rail`, `--surface-rail` | `--bg-rail` | background |
| `--surface-code` | `--bg-sunken` | background |
| `--surface-overlay` | `--bg-overlay` | background |
| `--panel-dim` | `--bg-card-dim` | background |
| `--panel`, `--surface-card` | `--bg-card` | background |
| `--surface-modal` | `--bg-modal` | background |
| `--input`, `--surface-input` | `--bg-input` | background |
| `--panel-hover`, `--surface-card-hover` | `--bg-card-hover` | background |
| `--surface-toast` | `--bg-toast` | background |
| `--input-border` | `--border-input` | border |
| | `--bg-fill` | background (Kbd, progress track, neutral Avatar) |
| `--border` | `--border-subtle` | border |
| `--border-2` | `--border-strong` | border |
| `--border-card-hover` | `--border-card-hover` (same name) | border |
| `--text`, `--text-body` | `--text-primary` | text |
| `--text-prose` | `--text-reading` | text |
| `--text-2`, `--text-secondary` | `--text-secondary` | text |
| `--text-3`, `--text-muted` | `--text-muted` | text |
| `--text-4`, `--text-faint` | `--text-faint` | text |
| `--on-accent` | `--text-on-accent` | text |
| `--accent` | `--text-accent` | text |
| | `--bg-accent` | background |
| | `--outline-focus` | outline (the focus ring) |
| `--accent-deep` | `--bg-accent-strong` | background |
| | `--border-focus` | border (a focused field) |
| `--blue` | `--text-blue` | text |
| `--green` | `--text-green` | text |
| | `--bg-green` | background (live dot, progress fill) |
| `--orange` | `--text-orange` | text |
| `--purple` | `--text-purple` | text |
| `--yellow` | `--text-yellow` | text |
| `--gold` | `--text-gold` | text |
| `--danger` | `--text-danger` | text |
| | `--bg-danger` | background |
| | `--border-invalid` | border (a field with `aria-invalid`) |
| `--tint-accent` | `--bg-accent-tint` | background |
| `--tint-blue` | `--bg-blue-tint` | background |
| `--tint-green` | `--bg-green-tint` | background |
| `--tint-orange` | `--bg-orange-tint` | background |
| `--tint-danger` | `--bg-danger-tint` | background |
| `--tint-yellow` | `--bg-yellow-tint` | background |
| `--scrim` | `--bg-scrim` | background |

New roles. Bob's components used these scale steps raw in 0.x. An app that copied one of the values
can use the role instead.

| Scale step | 1.0 token | Use |
| --- | --- | --- |
| `--gray-10` | `--bg-nav-hover` | NavRow hover |
| `--indigo-9-a18` | `--bg-accent-tint-strong` | Avatar accent |
| `--green-9-a18` | `--bg-green-tint-strong` | Avatar green |
| `--yellow-11-a10` | `--bg-claim-tint` | Chip claim |
| `--gold-9-a18` | `--bg-gold-tint` | Avatar gold |
| `--gray-17` | `--border-input-focus` | SearchInput key hint hover |
| `--gray-20` | `--border-strong-hover` | Button ghost hover |
| `--indigo-6` | `--border-accent-subtle` | TicketCard `sdd` |
| `--green-6` | `--border-green-subtle` | TicketCard `plan` |
| `--orange-9-a30` | `--border-orange-subtle` | TicketCard grill |
| `--purple-9-a28` | `--border-purple-subtle` | TicketCard probe |
| `--red-9-a40` | `--border-danger-subtle` | Button danger-ghost hover |
| `--red-9-a50` | `--border-danger` | Toast error |
| `--white` | `--text-on-solid` | Button accent and danger |
| `--red-11` | `--text-danger-soft` | Button danger-ghost |
| `--red-12` | `--text-danger-strong` | Toast error |
| `--yellow-11` | `--text-claim` | Chip claim |
| `--gray-21` | `--decoration-strike` | ListRow done line |

The scale steps themselves (`--gray-1` to `--gray-26`, `--indigo-9`, `--red-9-a40`, ...) keep their
names. So do `--shadow-*`, `--glow-*`, radii, fonts, sizes and layout tokens.

### Tailwind classes

In 0.x every role was a `--color-*` key, so it worked with every colour utility. In 1.0 a role is a
class of its own property only.

| 0.x class | 1.0 class |
| --- | --- |
| `bg-bg`, `bg-surface-app` | `bg-app` |
| `bg-bg-side`, `bg-surface-sidebar` | `bg-sidebar` |
| `bg-bg-rail`, `bg-surface-rail` | `bg-rail` |
| `bg-surface-code` | `bg-sunken` |
| `bg-surface-overlay` | `bg-overlay` |
| `bg-panel-dim` | `bg-card-dim` |
| `bg-panel`, `bg-surface-card` | `bg-card` |
| `bg-surface-modal` | `bg-modal` |
| `bg-input`, `bg-surface-input` | `bg-input` (same name) |
| `bg-panel-hover`, `bg-surface-card-hover` | `bg-card-hover` |
| `bg-surface-toast` | `bg-toast` |
| `bg-input-border` | `bg-fill` |
| `border-input-border` | `border-input` |
| `border-border` | `border-subtle` |
| `border-border-2` | `border-strong` |
| `border-border-card-hover` | `border-card-hover` |
| `text-text`, `text-text-body` | `text-primary` |
| `text-text-prose` | `text-reading` |
| `text-text-2`, `text-text-secondary` | `text-secondary` |
| `text-text-3`, `text-text-muted` | `text-muted` |
| `text-text-4`, `text-text-faint` | `text-faint` |
| `text-on-accent` | `text-on-accent` (same name) |
| `text-accent`, `bg-accent` | same names |
| `bg-accent-deep` | `bg-accent-strong` |
| `border-accent-deep` | `border-focus` |
| `text-blue`, `text-green`, `text-orange`, `text-purple`, `text-yellow`, `text-gold`, `text-danger` | same names |
| `bg-green`, `bg-danger` | same names |
| `bg-tint-accent`, `bg-tint-blue`, ... | `bg-accent-tint`, `bg-blue-tint`, ... |
| `bg-scrim` | `bg-scrim` (same name) |
| any other role on another property (`border-card`, `text-panel`, `bg-blue`) | none: use a scale step (`bg-blue-9`) |

One trap: **`border-input` changed colour.** In 0.x it was the input fill colour (`--input`,
gray-11) as a border. In 1.0 it is the input border (gray-15). Bob's components never used the 0.x
class. Check an app that did.

### Component props that take a colour

`StatusDot color`, `ProgressBar color`, `ListRow idColor`, `TicketCard idColor` and
`TicketCard label.color` take any CSS colour. Pass the 1.0 role for the property:

- StatusDot and ProgressBar paint a fill: `color="var(--bg-green)"`, `color="var(--bg-accent)"`.
  Their defaults are now `var(--bg-green)` and `var(--bg-accent)`.
- ListRow and TicketCard colour text: `idColor="var(--text-accent)"`. ListRow's default is now
  `var(--text-accent)`.

### How to migrate an app

1. Replace each `var(--old)` by the 1.0 token for the property that reads it. A plain search and
   replace is wrong for `--accent`, `--accent-deep`, `--green`, `--danger` and `--input-border`.
2. Replace each old class (Tailwind apps only).
3. Search for every old name once more. Bob's own gate, test/old-names.test.ts, shows how: it fails
   on any 0.x token or class in Bob's source.
4. Compare screenshots. A correct migration changes no pixel.

### Apps today

**pm-board** (client/src, on Bob 0.3.0): 148 uses of old tokens in 5 files, no Tailwind colour class. Its
branch `bob-1` holds the renames.

**Makron** (client/src, read only; Terje's PRs, PLAN-005 Task 7): 150 uses of old tokens in CSS
Modules and TSX, no Tailwind colour class.

| 0.x token | Uses | Files | 1.0 token |
| --- | --- | --- | --- |
| `--text-3` | 24 | 11 | `--text-muted` |
| `--border` | 23 | 9 | `--border-subtle` |
| `--accent` | 21 | 9 | `--text-accent`, `--bg-accent` or `--outline-focus` |
| `--text` | 17 | 12 | `--text-primary` |
| `--text-2` | 15 | 12 | `--text-secondary` |
| `--text-4` | 15 | 12 | `--text-faint` |
| `--green` | 12 | 11 | `--text-green` or `--bg-green` |
| `--danger` | 6 | 6 | `--text-danger`, `--bg-danger` or `--border-invalid` |
| `--border-2` | 4 | 4 | `--border-strong` |
| `--bg` | 3 | 3 | `--bg-app` |
| `--panel` | 3 | 2 | `--bg-card` |
| `--orange` | 1 | 1 | `--text-orange` |
| `--tint-green` | 1 | 1 | `--bg-green-tint` |
| `--tint-danger` | 1 | 1 | `--bg-danger-tint` |
| `--bg-side` | 1 | 1 | `--bg-sidebar` |
| `--panel-dim` | 1 | 1 | `--bg-card-dim` |
| `--panel-hover` | 1 | 1 | `--bg-card-hover` |
| `--surface-overlay` | 1 | 1 | `--bg-overlay` |

Makron also reads `--text-1` (3 uses) and `--panel-2` (2 uses, with a fallback). Bob never had
these tokens, in 0.x or in 1.0.

## Select (DD-036)

To be written by PLAN-005 Task 7 (TASK-041). Select moves from the native `<select>` to Base UI's
Select: `value`, `onValueChange(value)`, items as children.

## Toast (DD-036)

To be written by PLAN-005 Task 7 (TASK-041). Toast moves to Base UI's toast manager: an app adds a
toast with a call (`toast.add`), and ToastStack becomes the viewport.
