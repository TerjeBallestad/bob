# Changelog

## 0.4.1

PLAN-005 Task 4 (TASK-033), review nits.

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
