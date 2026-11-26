# Bob

The design system that Time Turtle and pm-board share: `@terjeballestad/bob` on npm, Storybook at
https://bob.godstemning.dev. The work is planned on the pm board: PLAN-002 in project SPRINT-002,
decisions DD-007 to DD-009 (`pm plan PLAN-002`, `pm get DD-008`). `pm` works here through
.pm.json, which names the pm-board-cli board on the pm server.

## Checks before you push

```sh
npm test                    # builds dist/, then the export and render tests on the built package
npm run typecheck
scripts/consumer-check.sh   # the packed package, type-checked in an npm workspace
npm run build-storybook && npm run test:visual:docker   # one screenshot per story, in Docker
```

`test:visual:docker` also runs axe on every story (WCAG 2.2 AA, visual/a11y.visual.ts), the
keyboard checks (visual/keyboard.visual.ts) and the reduced-motion checks. A contrast failure
that is not in visual/axe.ts fails it. The tests serve the webfonts from visual/fonts/, not
from Google. State stories (hover, focus, disabled, error) live in stories/<group>/States.stories.tsx.

The screenshot baselines come from the Playwright Linux image, never from macOS. Colima must run
(`colima start`). A change that looks different on purpose: take new baselines for the stories it
changes, look at each new image, and commit them with the change.

```sh
npm run build-storybook && npm run test:visual:docker -- --update-snapshots -g "<story id>"
```

A new story needs a baseline. Keep a story small enough to fit the 800x600 screenshot, or split it.

## Rules

- A component an app needs and Bob lacks goes into Bob, not into the app (PLAN-002).
- Semver. A new optional prop is a minor version. A changed or removed prop or token is a major one.
- Every release gets a CHANGELOG.md entry.
- Consumers pin an exact version (Time Turtle and pm-board), so a release reaches them only when
  they bump it. Time Turtle is Terje's course project: change it only in a PR that he merges.

## Release

Bump `version` in package.json, add the CHANGELOG entry, commit, push, then push a tag
`v<version>`. GitHub Actions publishes to npm with trusted publishing (no OTP) and builds
`ghcr.io/terjeballestad/bob-storybook:<version>`. To show it on bob.godstemning.dev, set that tag
in ~/dev/homelab `k8s/bob/deployment.yaml` and push homelab.
