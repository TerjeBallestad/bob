# Changelog

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
