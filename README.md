# Bob

Bob is the design system that Time Turtle and pm-board share: React components and the CSS
tokens they render against. One dark theme.

```sh
npm i @terjeballestad/bob
```

```tsx
import { Button, Chip, StatusDot } from '@terjeballestad/bob';

<Button variant="primary" size="sm" onClick={save}>Save</Button>
<Chip mono tone="green">admin</Chip>
<StatusDot state="live" color="var(--green)" size={7} />
```

An import from `@terjeballestad/bob` also loads `bob.css`: the tokens, the keyframes and the
component styles. You do not import a stylesheet yourself. If your bundler drops CSS that a
package imports, import `@terjeballestad/bob/styles.css` once at the root of your app.

`react` and `react-dom` 18.3 or later are peer dependencies.

## Layout

```
src/
  index.ts               barrel: every component and its prop types
  types.ts               DSOption / DSOptionInput, shared by Select and SegToggle
  styles.css             entry stylesheet, @imports tokens/
  tokens/                colors, typography, layout, fonts, base (reset + keyframes)
  components/
    core/                Avatar Button Chip Kbd ProgressBar SegToggle StatusDot
    forms/               FormRow Input SearchInput Select Textarea
    feedback/            Modal Toast ToastStack
    board/               ListRow NavRow SectionLabel TicketCard
TOKENS.md                what each CSS custom property means
```

## Conventions

- **Each component has a CSS Module** next to it (`Button.module.css`). The rules read the tokens as
  `var(--token)`. [TOKENS.md](./TOKENS.md) lists every token. Hover is a CSS `:hover` rule. No
  component keeps state.
- **Class names are scoped**, for example `bob_Button-module_btn_<hash>`, so they cannot clash with the app.
  Do not write app CSS that targets them. Pass `className` or `style` instead.
- **Overrides.** Components that wrap a native element (`Button`, `Chip`, `Input`, `Select`,
  `Textarea`, `SearchInput`) take `className` and forward every other attribute of that element.
  The other components take a `style` prop.
- **One dark theme.** There is no light mode and no theme switcher yet.
- **No icons.** Iconography is colored dots (`StatusDot`), mono text chips (`Chip mono`) and
  unicode characters. Do not add an icon set without a decision on the board.
- **Fonts** come from Google Fonts through an `@import` in `tokens/fonts.css`: Schibsted Grotesk
  and JetBrains Mono.

## Develop

```sh
npm install
npm test           # builds dist/, then runs the export and render tests
npm run typecheck  # also checks every exported type through the package name
```

`npm test` checks the built package, not the source: the exports match Time Turtle's original
barrel, every component renders with Bob's scoped class names, and `dist/index.js` imports
`bob.css`.

## Release

Bump the version in a commit, then push a tag `v<version>`. GitHub Actions runs the tests and
publishes to npm with trusted publishing, so no one types an OTP. A change to a prop or a token
name is a major version.

## Provenance

Bob 0.1.0 is `client/src/ds/` from Time Turtle at commit `bb93eea`, moved with no change to a
component, a style or a token. Only this README is new: the old one said that styling was inline
and that hover was component state, which was no longer true of the code.

Before that, the components were unpacked from `_ds_bundle.js`, a prebuilt IIFE that read
`window.React` and exported through a `window.PMBoardDesignSystem_cdbc5e` namespace (Time Turtle
SB-006). Behavior and every style value carried over unchanged. The `ui_kits/pm-board` demo app in
the bundle was dropped, because nothing imported it.
