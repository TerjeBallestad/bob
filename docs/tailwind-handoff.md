Historical note from 22 Nov 2026: it uses the names from before 1.0.

# Handoff: Bob on Tailwind, in the DaisyUI style

Written on 22 Nov 2026, at the end of a Claude Code session on branch `tailwind-prototype`.
Read this before you continue the work on any machine.

## What Terje wants

Terje wants Bob on Tailwind for two reasons:

1. **The apps.** pm-board and later Time Turtle write their own screens with Tailwind
   utilities, with Bob's tokens as the values (`bg-surface-card`, `text-text-2`).
2. **Bob itself.** Bob's components are written with Tailwind, because Tailwind is easier to
   write.

He likes the DaisyUI idea: semantic component classes (`btn btn-primary btn-sm`) on top of
Tailwind, themes as CSS variables, and no JavaScript where HTML is enough.

## What we decided

- **Bob gets its own DaisyUI-style layer. Bob does not use the DaisyUI package.** A DaisyUI
  theme takes hours, but it brings DaisyUI's look and class names. Its fixed theme slots
  (primary, secondary, base-100 to 300) do not fit Bob's tokens: Bob has four text levels and
  about ten surfaces. The board components (TicketCard, NavRow) need Bob's own classes in any case.
- **Tailwind v4, CSS only.** Each component class is a `@utility` in a CSS file. A `@utility`
  sorts with the normal utilities, so `<Button className="px-8">` works with no `tailwind-merge`.
- **The tokens stay the source of truth.** `src/tailwind/theme.css` maps them with
  `@theme inline` (`--color-surface-card: var(--surface-card)`). No token name changes.
- **The React API stays the same.** `<Button variant="primary">` renders `class="btn btn-md btn-primary"`.
  A consumer sees no prop change.
- **Bob keeps a precompiled `styles.css`.** Time Turtle does not use Tailwind and must not need it.
- **Shadcn style (the apps copy components in) is rejected.** It goes against PLAN-002 and
  DD-009: copies drift.
- **Timing (DD-007).** The move to `@utility` is allowed now only if it changes no pixel. The
  screenshot tests prove that. A change to the look waits until Time Turtle uses Bob.

## What the prototype does

Branch `tailwind-prototype`, off `main` at `9b3bf22`:

| File | Change |
|---|---|
| `package.json` | Adds `tailwindcss` and `@tailwindcss/vite` 4.3.5 as dev dependencies, pinned |
| `vite.config.ts` | Adds the Tailwind Vite plugin |
| `src/tailwind/theme.css` | New. All color tokens from `src/tokens/colors.css` as `@theme inline` values |
| `src/tailwind/components.css` | New. `btn`, `btn-sm/md`, six `btn-<variant>`, `chip`, `chip-mono`, eight `chip-<tone>`. The values are copied from the CSS modules |
| `src/styles.css` | Imports the two files and generates the utilities: `@tailwind utilities source(none)` plus `@source './components'`. No preflight and no cascade layer |
| `Button.tsx`, `Chip.tsx` | Use the new classes. Their `.module.css` files are deleted |
| `test/render.test.tsx` | Accepts `btn`/`chip` classes, and checks that `dist/bob.css` defines them |

All checks pass:
- `npm test`: 23 tests
- `npm run typecheck`
- `scripts/consumer-check.sh`
- `npm run test:visual:docker`: 24 screenshots, all equal to the `main` baselines, with `maxDiffPixels: 0`

**The method works.** The other 18 components are repeat work.

## Open questions

1. **Cascade layers for a Tailwind consumer.** `dist/index.js` imports `bob.css`, and the
   classes in `bob.css` have no layer. A Tailwind app puts its own utilities in
   `@layer utilities`, and CSS with no layer wins over any layer. So in a Tailwind app, `px-8`
   on a Button **loses** to the `padding` from `.btn-md` in `bob.css`. There are two possible fixes:
   - Bob puts its classes in `@layer utilities`. Then Bob's own unlayered `base.css` reset
     (`button { cursor: pointer }`) wins over them, and that can change pixels.
   - Bob ships a second entry for Tailwind apps (for example `@terjeballestad/bob/tailwind`)
     that does not import `bob.css`. The app generates Bob's classes itself, with
     `@import "@terjeballestad/bob/tailwind.css"`. That file holds `@source "./index.js"`, so
     the app needs no extra config.

   The second fix is the better choice. Test it in pm-board before you decide.
2. **Radius and font tokens are not in the theme.** Bob already uses Tailwind's names
   (`--radius-btn`, `--font-sans`). `--radius-btn: var(--radius-btn)` inside `@theme` refers
   to itself. Rename them (a major version) or keep them out of the theme.
3. **Class names collide.** `--color-text-2` gives `text-text-2`, which reads badly. Pick names
   before the first release, because a token change is a major version.
4. **Hover and focus have no screenshots.** The visual tests show the rest state only. Check
   hover by hand in Storybook, or add hover stories.
5. **The package export.** `src/tailwind/*.css` is not yet copied to `dist/`, and
   `package.json` has no `./tailwind.css` export.

## Next steps

1. Record the decision on the pm board as DD-010 in SPRINT-002 (`pm` from this repo).
2. Settle open question 1 with a test in pm-board.
3. Move the other 18 components, a few in each commit. Run the screenshot tests after each one.
4. Add the `./tailwind.css` export and a CHANGELOG entry. The release is 0.3.0: it adds and
   changes no prop or token.

## Settled in PLAN-005 Task 1 (26 Nov 2026)

The decision is DD-031 on the pm board; its comments hold the proof in pm-board.

1. **Cascade layers.** The second entry exists: `@terjeballestad/bob/tailwind.css`. The JS import
   still loads `bob.css`, so `bob.css` now puts all of Bob except the webfont import in the layer
   `base`. In pm-board, `<Button className="px-8">` gave 10px of padding before and 32px after.
   Bob's `base.css` reset is in the same layer, before the classes, so nothing changed in
   Storybook.
2. **Radius and font tokens.** They are in an `@theme inline reference` block. Tailwind learns the
   keys (`rounded-btn`, `font-mono`) and writes no variable, so nothing refers to itself. No token
   changed.
3. **Class names** such as `text-text-2` belong to Task 2 (DD-033, a proposal). The `@utility`
   rules use `var(--token)` only, so a rename of the theme keys does not touch them.
4. **Hover and focus.** A script hovered and focused every element with `cursor: pointer` and
   every form control in every story, in the Storybook from before the move and after it, and
   compared the screenshots byte for byte. Task 3 adds state stories.
5. **The package export.** `./tailwind.css` is in `package.json`. `scripts/copy-tailwind.mjs`
   copies `src/tailwind.css`, `src/tokens/` and `src/tailwind/` to `dist/`.

Found on the way: preflight sets line-height 1.5 on `html`, so an app written without it imports
`tailwindcss/theme.css` and `tailwindcss/utilities.css` only (README.md). And the CSS modules had
scoped the animation names `toast-in` and `pulse` to keyframes that did not exist, so a toast did
not slide in and a live card's dot did not pulse. As utilities, both run.
