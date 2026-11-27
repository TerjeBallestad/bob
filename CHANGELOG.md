# Changelog

## 0.4.1

PLAN-005 Task 4 (TASK-033), review nits.

### Bob 1.0.0, breaking: the colour roles get their DD-033 names

PLAN-005 Task 6 (TASK-037). A major version: every colour role has a new name, and the old names
are gone. docs/migration-1.0.md is the full guide; this entry holds its tables.

- **Each role is one token, named like its Tailwind class**: `--bg-card` is `bg-card`,
  `--text-primary` is `text-primary`, `--border-subtle` is `border-subtle`. 0.x had two names for
  many roles (`--bg` and `--surface-app`); 1.0 has one.
- **A role is for one property.** The theme maps backgrounds into `--background-color-*`, borders
  into `--border-color-*` and text into `--text-color-*`, so Tailwind makes `bg-card` and no
  `text-card`. A 0.x role used for two properties has one token per property: `--accent` is
  `--text-accent`, `--bg-accent` and `--outline-focus`.
- **No alias.** `--bg`, `--panel`, `--surface-*`, `--text-2`, `--tint-*` and the other 0.x names are
  removed, and so are their classes (`bg-surface-card`, `text-text-2`, `border-border`).
- **Scales are Tailwind colours**: `bg-gray-3`, `text-indigo-9`, `border-red-9-a40`, `text-white`.
  Bob's theme clears Tailwind's default palette, so `gray-500` and `black` no longer exist in an
  app that imports Bob's Tailwind entry.
- **New roles** for the values components used raw: `--bg-nav-hover`, `--bg-accent-tint-strong`,
  `--bg-green-tint-strong`, `--bg-claim-tint`, `--bg-gold-tint`, `--border-input-focus`,
  `--border-strong-hover`, `--border-accent-subtle`, `--border-green-subtle`,
  `--border-orange-subtle`, `--border-purple-subtle`, `--border-danger-subtle`, `--border-danger`,
  `--text-on-solid`, `--text-danger-soft`, `--text-danger-strong`, `--text-claim`,
  `--decoration-strike`. Components now use only roles.
- **Defaults of colour props**: StatusDot `color` is `var(--bg-green)`, ProgressBar `color` is
  `var(--bg-accent)`, ListRow `idColor` is `var(--text-accent)`. Same colours.
- **No value changed.** Each 1.0 token holds the exact value of the 0.x role it replaces
  (test/tokens.test.ts). Every component screenshot is unchanged. The Tokens pages print the
  new names, so their six screenshots differ.
- **A grep gate**: test/old-names.test.ts fails on any 0.x colour token or class in src/, stories/,
  .storybook/, README.md or TOKENS.md.

Tokens:

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

Classes:

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

### Earlier in this release

PLAN-005 Task 5 (TASK-036): Modal, SegToggle and ToastStack run on Base UI (DD-034). A minor
version: a new runtime dependency and new keyboard behaviour, with no change to any prop.

- **New dependency: `@base-ui/react` 1.9.0**, pinned exactly. It is Bob's first runtime
  dependency (React is a peer). It needs React 18.3 or 19. Bob does not bundle it: the app
  installs it with Bob.
- **Modal** is built on Base UI's Dialog. Escape closes it and calls `onClose`. Focus moves to
  the dialog when it opens, Tab and Shift+Tab stay inside it, and focus goes back to the opener
  when it closes.
  - The opener shows a focus ring after the modal closes.
  - Content outside an open Modal is hidden from screen readers.
  - It locks page scroll while it is open.
  - It renders nothing on the server. It mounts in the browser.
  - It sits in a portal at the end of `<body>`. Styles an app gives a wrapper element no longer
    reach it. The tokens are on `:root`, so the theme still applies. A test that looks for the
    dialog must search the whole page.
- **SegToggle** is built on Base UI's ToggleGroup. The group is one Tab stop, and Tab lands on
  the active segment. The arrow keys move focus between the segments and wrap; Home and End go
  to the ends. Enter or Space presses the focused segment. The group has `role="group"`.
  - The segments are no longer separate Tab stops. An app test that Tabs through them must use
    the arrow keys.
- **ToastStack** is built on Base UI's toast viewport: a polite live region named
  "Notifications". Keep it mounted, and a screen reader reads each toast added to it. Toast
  itself does not change.
- **Select and Toast** stay as they are. They move onto Base UI, with Base UI's API, in Bob 1.0
  (DD-036, PLAN-005 TASK-041).

Storybook, earlier in this release:

- **Storybook** (no change to the package's code): the docs describe Bob as a design system and
  component library for productivity tools, with no app names. The Introduction is shorter and
  teaches one way in, the Tailwind entry. Each component page shows its controls right under the
  story at the top. "Show code" prints plain JSX as an app writes it, with Tailwind utilities on
  layout wrappers. Avatar, Kbd, StatusDot, FormRow, Toast, ListRow and NavRow get a one-component
  Default story with controls; their former Default is a new story (Tones, Keys, States, Form,
  Success and error, Rows, Sidebar).
- The package description and the README no longer name the apps, and the README teaches the
  Tailwind entry only. The JS import and `styles.css` stay in the package.

## 0.4.0

PLAN-005 Task 3 (TASK-032): focus, accessibility checks, state screenshots, animations. Task 4
(TASK-033): the Storybook documents Bob.

- **Every control shows keyboard focus**: a 2px `--accent` ring, 2px outside, on
  `:focus-visible` (new tokens `--focus-ring-width`, `--focus-ring-offset`). Input, Select,
  Textarea and SearchInput no longer set `outline: none`.
- **ListRow and TicketCard with `onClick` are keyboard controls**: role `button`, in the Tab
  order, Enter and Space click them. Without `onClick` they stay plain.
- **ARIA**: Modal is a `dialog` with `aria-modal`, named by its title; its close button is named
  Close. SegToggle options have `aria-pressed`. A Toast is a `status`, an error Toast an `alert`.
  ProgressBar is a `progressbar` with its values and a name, the new optional prop `label`
  ("Progress" by default). NavRow's active row has `aria-current="page"`.
  FormRow's label names its one child control (`htmlFor` and an id). Bob's buttons have
  `type="button"`, so they do not submit a form.
- **Error state**: Input, Select, Textarea and SearchInput show a `--danger` border with
  `aria-invalid="true"`.
- **Animations are Tailwind theme keys**: `animate-live`, `animate-toast-in`, `animate-card-in`,
  `animate-slide-in` (TOKENS.md). They run only under `motion-safe`. StatusDot's live pulse is a
  class (`status-dot-live`), not an inline style. The keyframe `pulse` is now `live-pulse`, with
  the same timing. `bob.css` holds only the keyframes Bob's components use, so `card-in` and
  `slide-in` are no longer in it; a Tailwind app gets them from `animate-card-in` and
  `animate-slide-in`.

- **Storybook documents every component** (no change to the package): a page per component with
  when to use it, do and don't, states, props and keyboard notes; a new Introduction with the
  one-line import; a Bob theme; interaction tests for Modal, Select, SegToggle and Toast. Story
  ids changed (`core--button-story` is now `core-button--default`), so old links to stories break.

## 0.3.0

Bob is a Tailwind library in the daisyUI style (DD-031). No prop and no token name changes.

- **`@terjeballestad/bob/tailwind.css`**, a new entry for Tailwind v4 apps. Add
  `@import "@terjeballestad/bob/tailwind.css";` after your Tailwind import. Your build then writes
  Bob's component classes in its utilities layer, only the ones in use, and they take variants
  (`md:btn-sm`). `<Button className="px-8">` gets 32px of side padding over Bob's. The theme maps
  the colour tokens (`bg-surface-card`) and the radius and font tokens (`rounded-btn`,
  `font-mono`). README.md says how to import Tailwind without its preflight.
- **Every component renders Bob's component classes** with no prefix, such as `btn btn-md
  btn-primary`, `chip chip-green`, `ticket-card`, `nav-row nav-row-active`, instead of scoped
  CSS-module names (`bob_Button-module_btn_<hash>`). The values are the same: the screenshots
  match 0.2.0 with no pixel changed, and so do 174 hover and focus states (compared with the live
  pulse below turned off; while it runs, card corners near it differ by 1 in one colour channel).
- **`bob.css` sits in the cascade layer `base`**, all but the webfont import. A Tailwind app
  loads it through the JS import too, and in a layer it loses to the app's utilities. An app
  with no Tailwind: an unlayered element rule of yours, such as `button { color: inherit }`, now
  wins over Bob's classes. Put such rules in `@layer base`.
- **Two animations run that did not.** The CSS modules had scoped the names `toast-in` and
  `pulse` to keyframes that did not exist. Now a Toast slides in over 0.18s, and a live
  TicketCard's dot pulses as a live StatusDot does.
- **Colours are scales and roles** (PLAN-005 Task 2). Every value is a step on a scale (gray-1 to
  gray-26, and the hue scales), and every 0.2.0 token is a role that points at a step, with the
  same value. The components use steps, not raw colours. Storybook's Tokens pages show the
  scales, the roles and their contrast.

## 0.2.0

- `TicketCard` takes `label` (a type label such as MAP or PLAN, for a record with no ticket kind),
  `note` (small text in the foot, such as "3 comments") and `idColor` (the id's colour when there
  is no kind). Added for pm-board's dashboard, which shows designs and plans on the kanban board.
  A card that does not use them renders exactly as before; the screenshot tests confirm it.

## 0.1.1

- `@types/react` is a required peer dependency, so npm places it where Bob's type declarations can
  see it. Time Turtle's typecheck failed with 0.1.0.

## 0.1.0

- Time Turtle's `client/src/ds/` as its own package, with no change to a component, a style or a
  token.
