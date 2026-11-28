# Changelog

## 1.3.0

A minor version: one new text style. Nothing an app sees changes until it uses it.

- New text style `text-item`: 12.5px (`--fs-body`), line height `normal`, weight 500
  (`--fw-medium`). It is the title of an item in a row or on a card, and a task input. Before
  1.3 an app had no style for 12.5px at 500, and DD-038 allows no `font-medium` next to a style
  (SB-024, Makron's task input and locked-row label).
- ListRow's `list-row-title` and TicketCard's `ticket-card-title` now take their size and weight
  from `text-item` (`@apply text-item`), not from their own 12.5px and 500. They look the same.
  `ticket-card-title` keeps its line height of 1.45, because a card title wraps.
  `list-row-title` now sets line height `normal`; before, it inherited the row's. Without
  Tailwind's preflight, as Bob's components assume (README), that was `normal` too, so pm-board
  and Makron see no change. An app with preflight sees the title's line height go from 1.5 to
  `normal`.

## 1.2.0

A minor version by Terje's choice (DD-038, SB-023), as an exception to the semver rule in
README.md: some classes change their output and some are gone, which the rule would make a major
version. Bob's type becomes a set of text styles, Bob owns the radius and type scales, and an app
gets classes for what Makron's review found it lacked. docs/migration-1.2.md lists what an app
changes, with each class rename and each value that moves.

### Changes with no code edit

An app sees these as soon as it bumps the version:

- **Gone:** `rounded-2xl`, `rounded-3xl` and `rounded-4xl`, with their side and corner forms
  (`rounded-t-2xl`, ...), and the theme variables `--radius-md` and `--radius-2xl` to
  `--radius-4xl`.
- **Gone:** Tailwind's text sizes `text-xs` to `text-9xl` and their `--text-*` variables. Bob
  clears them (`--text-*: initial`), as it clears Tailwind's colours and radii.
- **Changed:** `rounded` and `rounded-md` are Bob's 8px (`--radius`), not Tailwind's 4px and 6px.
- **Changed:** `text-micro`, `text-prose`, `text-title` and `text-doc` now set a line height, and
  `text-micro`, `text-title` and `text-doc` a weight and letter spacing (the table below). A
  weight or tracking class on the same element still wins; a line height moves. In Makron the
  sidebar brand (`text-prose`, now 1.65) pushes the nav down about 2px, and the first-run and
  login cards grow.
- **Changed:** `text-tiny`, `text-caption`, `text-body` and `text-base` set line height `normal`.
  Without Tailwind's preflight (pm-board, Makron) most text has `normal` already, but an element
  that inherited its parent's line height (inside `leading-loose`, or `.md` at 1.65) moves from
  that value to `normal`. With preflight
  (README's `@import "tailwindcss"`), each such line goes from 1.5 to `normal`.
- **Changed:** every Button is `type="button"` unless the app sets `type`. In 1.1 only
  `variant="text"` was; the others submitted a form they sat in. A Button that submits says
  `type="submit"`.
- **Renamed, still works:** `text-doc` and `--fs-doc` are deprecated names of `text-display` and
  `--fs-display`. They work through 1.x and go in 2.0.

### Text styles

- Each `--text-*` key in `tailwind/theme.css` now sets the font size, the line height, and where
  the style needs them the letter spacing and the weight, through Tailwind's
  `--text-*--line-height`, `--text-*--letter-spacing` and `--text-*--font-weight`. An app writes
  one class: `text-label`, not `text-tiny font-semibold tracking-label`.
- 14 styles and a deprecated alias. The ramp names (`text-micro` to `text-display`) are each
  size's plain style. Five role names are second styles at a size: `text-id` and `text-label`
  (10.5px), `text-note` (11.5px), `text-subhead` (12.5px) and `text-heading` (13.5px). The set
  comes from the combinations Bob's components, pm-board and Makron use.
- New 18px step: `--fs-headline` and `text-headline` (1.3, -.01em, 700), for a heading inside a
  document (pm-board's markdown h1). The top of the ramp reads title (15px), headline (18px),
  display (21px).
- `text-doc` is renamed `text-display`, and `--fs-doc` `--fs-display`. The old names stay as
  deprecated aliases through 1.x.
- One-line styles set `line-height: normal`. `text-note` (1.5), `text-prose` (1.65),
  `text-title`, `text-headline` and `text-display` (1.3) set a number.
- A style sets no case and no family (Tailwind's text styles cannot): a label adds `uppercase`,
  an id adds `font-mono`.
- New tokens: `--ls-tag` (.05em, TicketCard's kind and priority now read it), `--lh-heading`
  (1.3), `--lh-note` (1.5), `--lh-prose` (1.65).
- `tracking-heading` and `tracking-label` stay.

### Radius

- Bob's theme clears Tailwind's radii (`--radius-*: initial`) and sets its own steps:
  `rounded-xs` 2px, `rounded-sm` 4px, `rounded-md` and `rounded` 8px (`--radius`), `rounded-lg`
  10px, `rounded-xl` 12px. `rounded-btn` (7px), `rounded-chip` (5px) and `rounded-kbd` (4px) stay.
- Changed for an app: `rounded-md` 6px to 8px, `rounded` 4px to 8px. `rounded-2xl` to
  `rounded-4xl` are gone. `rounded-none` and `rounded-full` stay.
- A radius off the size steps moves to the nearest one, and a tie rounds up (DD-037): 3px to
  `rounded-sm`, 6px to `rounded-md`.
- New tokens `--radius-xs` (2px) and `--radius-sm` (4px). `--radius-kbd` reads `--radius-sm`, the
  same 4px. ProgressBar and TicketCard's progress read `--radius-xs`, the same 2px.

### Shadows

- `shadow-toast`, `shadow-modal` and `shadow-overlay` are classes over Bob's tokens.
- New: `--shadow-popup` (`0 12px 32px`, black at 45%) for a list that drops from a field, and
  `--shadow-panel` (`0 28px 64px -22px`, black at 75%) for a panel alone over a picture. Both
  replace raw values in Makron. New scale steps `--black-a45` and `--black-a75`.

### Colour

- `--indigo-10` `#9aa1f0`, indigo 9's hover step (Radix step 10), for a link under the pointer.
  `text-indigo-10` and every other colour utility work.

### Button: `type="button"`, size `xs` and variant `danger-tint`

- A change: every variant is `type="button"` unless the app sets `type` (above).
- `size="xs"` (`btn-xs`): 10.5px, 1px by 6px around the label with the border (a mono chip's
  padding), the Kbd radius. For a button inside a dense row. It works with every variant. It is
  about 16px high, under WCAG 2.2's 24px target; the design pass decides.
- `variant="danger-tint"` (`btn-danger-tint`): the danger tint, `--text-danger-soft` text (5.5:1
  on a card, AA), weight 500, hover to `--text-danger-strong`. Makron's row stop button is
  `<Button variant="danger-tint" size="xs" className="font-mono">`.
- `ButtonSize` gains `'xs'`, `ButtonVariant` gains `'danger-tint'`.

### Modal and SectionLabel take `className`

- It goes on the modal box and on the label, after Bob's class, so an app's utility wins.

### Screenshots

New baselines for the stories that show the additions: `tokens--type` (the 18px step, the
`display` name), `tokens--type-classes` (now "Text styles"), `tokens--radius-shadow-space`, `tokens--hues` (indigo 10, the new black steps),
`tokens--contrast-pairs-in-use` (Button danger-tint), `core-button--variants` (an `xs` row and
`danger-tint`), `core-button--text` (a running row's stop; the `×` is `text-base`, as in
Makron) and `core-states--buttons` (a `danger-tint` row). No existing component looks different.

## 1.1.0

A minor version: two new sets of Tailwind classes and a new Button variant. Nothing is removed,
and every component looks as it did. Makron's review (PR #6) asked for both, so an app needs no
custom values (`text-(length:--fs-tiny)`, `text-[10px]`) and no local TextButton.

### Type classes from Bob's ramp

- **Font sizes**: `tailwind/theme.css` maps the ramp into Tailwind's `--text-*` namespace.
  `text-micro` 9.5px, `text-tiny` 10.5px, `text-caption` 11.5px, `text-body` 12.5px, `text-base`
  13px, `text-prose` 13.5px, `text-title` 15px, `text-doc` 21px. Each reads its token:
  `.text-tiny { font-size: var(--fs-tiny) }`.
- **No line height.** A size class sets only `font-size`, as Bob's components set their own line
  heights. Tailwind's sizes carry one, so a Bob size with one would move the line box of any
  element that uses it.
- **`text-base` is Bob's 13px**, the body default, and no longer Tailwind's 1rem with line-height
  1.5. Bob, pm-board and Makron did not use `text-base`, or any of Tailwind's `text-xs` to
  `text-9xl`, before this release. Tailwind's other sizes keep their values and line heights.
  Bob's rule makes a changed token a major version. This one is minor because no consumer used
  the class, and DD-037 puts every app's type on Bob's ramp.
- **No name collides.** The size keys are not colour keys (DD-033), so `text-primary` and
  `text-muted` stay colours, and `text-tiny text-muted` sets both.
- `--text-body` and `--text-prose` were 0.x colour tokens. In 1.1 they are font-size keys in
  the theme. The theme is `inline`, so a build writes `--text-body` only when a source file
  names it. A 0.x `var(--text-body)` then reads 12.5px, an invalid colour, so its fallback no
  longer applies. test/old-names.test.ts still finds every old use, and lets only the theme's
  own keys through.
- **Letter spacing**: `tracking-heading` (`--ls-heading`, -0.01em) and `tracking-label`
  (`--ls-label`, 0.08em). Tailwind's `tracking-tight` to `tracking-widest` stay.
- **Line heights**: Bob has no line-height tokens. An app uses Tailwind's `leading-normal` (1.5),
  `leading-relaxed` (1.625) or `leading-loose` (2).
- Storybook: Foundations / Tokens has a new page, "Type: Tailwind classes", that renders each
  class. Storybook's own Tailwind build now loads Tailwind's theme and Bob's, as an app does.

### Button: `variant="text"`

- A button that reads as text, for "stop" in a top bar, "sign out", or a row's delete `×`. It
  replaces Makron's local TextButton.
- It renders `btn btn-text` and no size class, so `size` has no effect. `btn-text` sets no
  border, no fill and no padding, and inherits the font, colour, letter spacing and text
  transform. An app sets them with classes: `className="text-caption text-muted hover:text-primary"`.
  The app's font, size, colour, letter-spacing and case classes win over `btn-text` in the
  app's build (tested). Fill and border classes such as `bg-card` and `border` sort before it
  and lose, as they do against `btn-primary`. A button that needs a fill or border uses another
  variant.
- It is `type="button"` unless the app sets `type`. The other variants keep the native default.
- It keeps Bob's focus ring and Button's disabled style (half opacity, default cursor). It has
  no hover style of its own.
- New stories: Core / Button / Text and Core / States / Text button.
- New exports: none. `ButtonVariant` gains `'text'`.

## 1.0.0

Bob 1.0.0 is a major version with three breaking changes, so an app migrates once:
docs/migration-1.0.md covers all three, with before-and-after code.

1. The colour roles get their DD-033 names (PLAN-005 Task 6).
2. Select is Base UI's Select, with Base UI's API (DD-036, PLAN-005 Task 7).
3. Toast moves to Base UI's toast manager: an app adds a toast with a call (DD-036, Task 7).

Modal, SegToggle and ToastStack moved onto Base UI earlier in this release (Task 5), with no prop
change.

### Breaking: Select and Toast on Base UI, with Base UI's API

PLAN-005 Task 7 (TASK-041, DD-036). Both start from shadcn/ui's Base UI code, restyled as Bob
classes (DD-031).

- **Select** is Base UI's Select. The native `<select>`, its `options` prop and its `onChange`
  event are gone. The items are children: `Select` holds the state (`value` or `defaultValue`,
  `onValueChange(value)`, `items`, `name`, `disabled`, `required`), and `SelectTrigger`,
  `SelectValue`, `SelectContent` and `SelectItem` lay it out. `SelectGroup`, `SelectLabel` and
  `SelectSeparator` are new.
  - The list is Bob's, the same on every platform. Enter, Space and ↓ open it; the arrows, Home,
    End and typeahead move in it; Enter chooses; Escape and Tab close it and give focus back to
    the trigger.
  - `className`, `aria-label`, `aria-invalid` and `aria-describedby` go on `SelectTrigger`. A
    FormRow label still names it.
  - The list renders in a portal at the end of `<body>`. `name` writes a hidden input, so a form
    gets the value.
  - Classes: `select` is now `select-trigger`; `select-option` is gone; new `select-value`,
    `select-icon`, `select-positioner`, `select-popup`, `select-list`, `select-item`,
    `select-item-text`, `select-item-indicator`, `select-group`, `select-label`,
    `select-separator`, `select-scroll-arrow`, `select-scroll-up`, `select-scroll-down`.
- **Toast** comes from Base UI's toast manager. An app calls `toast.add({ title, description,
  type })` on a manager from `createToastManager()`, or on `useToastManager()` inside the stack.
  `Toast` and `ToastProps` are gone; `type: 'error'` replaces the `error` prop.
  - **ToastStack** is the provider and the viewport. It takes the app as `children`, and
    `toastManager`, `timeout` (4000 ms) and `limit` (3).
  - Base UI brings the timers, a pause on hover and focus, swipe to close, F6 to the stack, and
    Escape on a focused toast. Each toast has a Close button.
  - A screen reader reads each toast once: two hidden live regions beside the stack, polite for
    a success, assertive for an error. The stack is a region named "Notifications", not a live
    region. 0.x nested `role="status"` and `role="alert"` in a polite region, which some screen
    readers read twice.
  - A toast is a `dialog` named by its title. New classes: `toast-text`, `toast-title`,
    `toast-description`, `toast-close`. `toast`, `toast-error` and `toast-stack` keep their names.
  - New exports: `createToastManager`, `useToastManager`, and the types `ToastOptions`,
    `ToastUpdateOptions`, `ToastManager`, `UseToastManager`, `ToastObject`, `ToastType`.
  - Bob's `add` and `update` take Bob's options: `title` is required (it names the toast),
    `type` is `'success'` or `'error'`, and `priority` is dropped, in the types and at run time.
    A toast with only a description (from `toast.promise` with a string) is named by it.
  - A success closes after `timeout`. An error stays until the user closes it, unless the app
    gives it a `timeout` (WCAG 2.2.1). `timeout: 0` keeps any toast open.
  - Toast text stays selectable, so a user can copy an error; a swipe selects nothing.
- **Bundle cost** (an app that imports one component; minified, gzip, React external, Base UI
  included): ToastStack 31.4 kB, about 0.4 kB more than the viewport alone in Task 5; Select
  48.8 kB; an app with Select, ToastStack and Modal shares Base UI's core, 62 kB for the three.
  An app that imports neither pays nothing for them: test/treeshake.test.ts keeps a Button-only
  app under 2 kB.
- **Screenshots**: the Select and Toast stories have new baselines. Two other stories show the new
  Select trigger, forms-states--fields and forms-formrow--form, and the Tokens page "Radius,
  shadow and space" counts the new CSS's spacing values.

### Breaking: the colour roles get their DD-033 names

PLAN-005 Task 6 (TASK-037). A major version: every colour role has a new name, and the old names
are gone. The migration guide has the tables from each old token and class to its new one:
https://github.com/TerjeBallestad/bob/blob/main/docs/migration-1.0.md

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
- **Two classes keep their name and change colour**: `border-input` and `border-danger`. The
  guide says what to use instead.
- **A grep gate**: test/old-names.test.ts fails on any 0.x colour token or class in src/,
  stories/, .storybook/, visual/, scripts/, docs/ (except the guide), the built dist/, README.md
  and TOKENS.md.

### Modal, SegToggle and ToastStack on Base UI

PLAN-005 Task 5 (TASK-036): Modal, SegToggle and ToastStack run on Base UI (DD-034). Part of
1.0.0: a new runtime dependency and new keyboard behaviour, with no change to any prop.

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
- **ToastStack** is built on Base UI's toast viewport. Task 7 then moved it to Base UI's toast
  manager, above.
- **Select and Toast** moved onto Base UI, with Base UI's API, in Task 7, above.

## 0.4.1

PLAN-005 Task 4 (TASK-033), review nits.

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
