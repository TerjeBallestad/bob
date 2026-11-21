# Changelog

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
