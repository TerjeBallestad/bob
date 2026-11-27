# Migrating to Bob 1.0

Bob 1.0 is a major version. An app moves to it once. This guide covers three changes:

1. The colour roles get their DD-033 names (PLAN-005 Task 6, TASK-037).
2. Select moves onto Base UI, with Base UI's API (DD-036, Task 7, TASK-041).
3. Toast moves onto Base UI's toast manager (DD-036, Task 7, TASK-041).

## Colour roles (DD-033)

### What changed

- **Each role is one token, named like its Tailwind class.** `--bg-card` is `bg-card`,
  `--text-primary` is `text-primary`, `--border-subtle` is `border-subtle`.
- **A role is for one property.** `--bg-*` is a background, `--border-*` a border colour, `--text-*`
  a text colour. Tailwind makes `bg-card` but no `text-card` or `border-card`.
- **The 0.x names are gone.** Bob 1.0 keeps no alias. `--bg`, `--panel`, `--surface-*`, `--text-2`,
  `--tint-*` and the others no longer exist. A `var()` of an old name with no fallback makes the
  property behave as unset: `color` inherits, a background becomes transparent. There is no error,
  but the colour is lost.
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
If no 1.0 role exists for that property, use the scale step with the same value: `--accent` as a
border is `--indigo-9`.

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
| `border-danger` | `border-invalid` for a field error (see the traps below) |
| `bg-tint-accent`, `bg-tint-blue`, ... | `bg-accent-tint`, `bg-blue-tint`, ... |
| `bg-scrim` | `bg-scrim` (same name) |
| any other role on another property (`border-accent`, `text-panel`, `bg-blue`) | none: use the scale step with the same value (`border-indigo-9`, `bg-blue-9`) |

These classes keep their name and their value: `bg-input`, `bg-accent`, `bg-danger`, `bg-green`,
`bg-scrim`, `text-on-accent`, and the hue text classes `text-accent`, `text-blue`, `text-green`,
`text-orange`, `text-purple`, `text-yellow`, `text-gold` and `text-danger`.

Two traps: two classes keep their name and change their colour. Bob's components never used the 0.x
classes. Check an app that did.

- **`border-input`.** In 0.x it was the input fill colour (`--input`, gray-11) as a border. In 1.0
  it is the input border (gray-15).
- **`border-danger`.** In 0.x it was solid red-9 (`--danger`). In 1.0 it is red-9-a50, the error
  Toast's border. A field error is `border-invalid` (red-9).

### Component props that take a colour

`StatusDot color`, `ProgressBar color`, `ListRow idColor`, `TicketCard idColor` and
`TicketCard label.color` take any CSS colour. Pass the 1.0 role for the property:

- StatusDot and ProgressBar paint a fill: `color="var(--bg-green)"`, `color="var(--bg-accent)"`.
  Their defaults are now `var(--bg-green)` and `var(--bg-accent)`. StatusDot also draws its border
  in that colour in the `outline` and `staged` states. For a colour with no `bg-*` role, pass the
  scale step: `var(--blue-9)`.
- ListRow and TicketCard colour text: `idColor="var(--text-accent)"`. ListRow's default is now
  `var(--text-accent)`.

### How to migrate an app

1. Replace each `var(--old)` by the 1.0 token for the property that reads it. A plain search and
   replace is wrong for `--accent`, `--accent-deep`, `--green`, `--danger` and `--input-border`.
   If no 1.0 role exists for that property, use the scale step with the same value: `--accent` as a
   border is `--indigo-9`.
2. Replace each old class (Tailwind apps only).
3. Search for every old name once more. Bob's own gate, test/old-names.test.ts, shows how: it fails
   on any 0.x token or class in Bob's source.
4. Compare screenshots. A correct migration changes no pixel.

### Apps today

**pm-board** (client/src, on Bob 0.3.0): 148 uses of old tokens in 5 files, no Tailwind colour
class. Its branch `bob-1` holds the renames.

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

### What changed

- **Select is Base UI's Select**, from shadcn/ui's Base UI code. The native `<select>` is gone. The
  list is Bob's: the same look on every platform, with typeahead.
- **The items are children.** The `options` prop is gone. Select holds the state; SelectTrigger,
  SelectValue, SelectContent and SelectItem lay it out. SelectGroup, SelectLabel and
  SelectSeparator are new.
- **`onValueChange(value)` replaces `onChange(event)`.** It gets the value itself, not an event.
  Its type includes `null` (a select with no value), so a setter for a `string` needs a guard:
  `onValueChange={(v) => v !== null && setStage(v)}`. Test for `null`, not for a falsy value:
  an empty string is a value an item can have.
- **`items` shows the label.** Pass the `{ value, label }` list to Select as `items`, and the
  trigger shows the chosen item's label. Without it the trigger shows the raw value.
- **The attributes move to SelectTrigger**: `className`, `aria-label`, `aria-invalid`,
  `aria-describedby`. Select itself takes `value`, `defaultValue`, `onValueChange`, `items`,
  `name`, `disabled`, `required` and `id`. FormRow still names it: the `id` it gives Select lands on
  the trigger.
- **The trigger is a `<button role="combobox">`**, not a `<select>`. The list is a `listbox` in a
  portal at the end of `<body>`. A form still gets the value: `name` writes a hidden input.
- **Classes.** `select` is now `select-trigger`, and `select-option` is gone. New:
  `select-value`, `select-icon`, `select-positioner`, `select-popup`, `select-list`,
  `select-item`, `select-item-text`, `select-item-indicator`, `select-group`, `select-label`,
  `select-separator`, `select-scroll-arrow`, `select-scroll-up`, `select-scroll-down`.
- **No `DSOptionInput` in Select.** `normalizeOption` and the `DSOption` types stay, for SegToggle.

### Before and after

Before (0.x):

```tsx
<FormRow label="Stage">
  <Select
    value={stage}
    onChange={(e) => setStage(e.target.value)}
    options={['inbox', 'planned', { value: 'done', label: 'Done' }]}
    className="w-40"
    aria-invalid={error ? 'true' : undefined}
  />
</FormRow>
```

After (1.0):

```tsx
const stages = [
  { value: 'inbox', label: 'inbox' },
  { value: 'planned', label: 'planned' },
  { value: 'done', label: 'Done' },
];

<FormRow label="Stage">
  <Select items={stages} value={stage} onValueChange={(v) => v !== null && setStage(v)}>
    <SelectTrigger className="w-40" aria-invalid={error ? 'true' : undefined}>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {stages.map((s) => (
        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
      ))}
    </SelectContent>
  </Select>
</FormRow>
```

An app with many selects can keep a small wrapper of its own that takes the 0.x `options`:

```tsx
function OptionSelect({ options, value, onChange, className }: {
  options: DSOptionInput[]; value: string; onChange: (v: string) => void; className?: string;
}) {
  const items = options.map(normalizeOption);
  return (
    <Select items={items} value={value} onValueChange={(v) => v !== null && onChange(v)}>
      <SelectTrigger className={className}><SelectValue /></SelectTrigger>
      <SelectContent>
        {items.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}
```

### Traps

- **An empty string counts as no value.** 0.x apps used `{ value: '', label: '— no project' }` for
  "none". It still works as an item, and the trigger shows its label, in the muted placeholder
  colour. A `placeholder` on SelectValue would win over that label, so leave it out there.
  Base UI's own way is an item with `value: null`.
- **A test that read `e.target.value`, or used `selectOptions`, must change.** Click the trigger,
  then click the option by its role (`getByRole('option', { name })`) in the whole page, since the
  list is in a portal.
- **A click on the FormRow label opens the list.** A native select only took focus. The label
  points at the trigger, a button, and a click on a label clicks its button.
- **`form.reset()` does not reset an uncontrolled Select.** It keeps its last value. Use `value`
  and `onValueChange`, and reset the state.
- **CSS that targeted `select` or `.select`** (an app's own size overrides) must target
  `.select-trigger`.

## Toast (DD-036)

### What changed

- **A toast is a call.** An app adds one with `toast.add({ title, description, type })`, from a
  manager (`createToastManager()`) or the hook (`useToastManager()`). It no longer renders
  `<Toast>` elements or keeps its own list and timers. `Toast` and `ToastProps` are gone.
- **ToastStack is the provider and the viewport.** It takes the app as `children`, and
  `toastManager`, `timeout` (4000 ms) and `limit` (3). It still sits bottom centre, newest at the
  bottom.
- **Base UI does the behaviour**: the timers, a pause while the pointer is over the stack or
  focus is in it, swipe down or right to close, F6 to the stack, Escape on a focused toast, and a
  Close button on each toast.
- **`type: 'error'` replaces `error`.** It keeps the red border and light red text
  (`toast-error`), and a screen reader reads it at once (assertive). A success is read when the
  screen reader is idle (polite). Do not pass Base UI's `priority`: Bob reads `type`.
- **One announcement per toast.** The stack is a region named "Notifications", not a live
  region. Two hidden live regions beside it read each toast once. 0.x put `role="status"` and
  `role="alert"` toasts inside a polite region, which some screen readers read twice.
- **New exports**: `createToastManager`, `useToastManager`, and the types `ToastOptions`,
  `ToastUpdateOptions`, `ToastManager`, `UseToastManager`, `ToastObject`, `ToastType`. Bob's
  `add` and `update` take Bob's options: `title` is required, `type` is `'success'` or
  `'error'`, and Base UI's `priority` is not an option.
- **Classes.** `toast`, `toast-error` and `toast-stack` keep their names. New: `toast-text`,
  `toast-title`, `toast-description`, `toast-close`.

### Before and after

Before (0.x): the app keeps the list and the timers.

```tsx
const [toasts, setToasts] = useState<{ id: number; text: string; error?: boolean }[]>([]);
const toast = (text: string, error?: boolean) => {
  const id = Date.now() + Math.random();
  setToasts((t) => [...t, { id, text, error }]);
  setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
};

<ToastStack>
  {toasts.map((t) => <Toast key={t.id} error={t.error}>{t.text}</Toast>)}
</ToastStack>
```

After (1.0): a manager, created once.

```tsx
// toast.ts
import { createToastManager } from '@terjeballestad/bob';
export const toast = createToastManager();

// App.tsx
<ToastStack toastManager={toast} timeout={3000}>
  <App />
</ToastStack>

// anywhere
toast.add({ title: 'Title updated' });
toast.add({ title: 'Could not save', type: 'error' });
```

An app that passes a `toast(text, error)` function down (pm-board's BoardProvider) keeps that
shape with one line:

```tsx
const notify = (text: string, error?: boolean) => toast.add({ title: text, type: error ? 'error' : 'success' });
```

### Traps

- **Keep ToastStack mounted**, around the app or at its end. A screen reader reads only text
  added to a live region that was already in the page.
- **`useToastManager()` works only inside ToastStack.** Outside it, use a manager from
  `createToastManager()` and pass it to ToastStack.
- **A toast is a `dialog`, named by its title**, with a Close button. A test that looked for
  `role="status"` or `role="alert"` must look for `getByRole('dialog', { name })`, or for the text.
- **A success closes after `timeout`, and an error stays.** In 0.x the app owned the timers.
  Now ToastStack's `timeout` (4000 ms), or the toast's own, closes a success. An error stays
  until the user closes it, unless the app passes a `timeout` for it. `timeout: 0` keeps any
  toast open.
- **`title` is required, and `priority` and other `type` strings are not options.** Bob reads
  `type` to choose the live region, and drops `priority` at run time too.

## Apps today: Select and Toast

**pm-board** (client/src): no Select. Toast in App.tsx: a `useState` list, a `toast(text, error)`
callback with a 3-second `setTimeout`, passed to BoardProvider, and a `<ToastStack>` of `<Toast>`
elements. Change: a manager, `<ToastStack toastManager={toast} timeout={3000}>`, and the callback
becomes `toast.add({ title: text, type: error ? 'error' : 'success' })`. Its e2e test "Start
copies the configured command" finds the "Copied" toast by its text. That still works, and
`getByRole('dialog', { name })` finds it too.

**Makron** (client/src, read only; Terje's PRs):

- Toast: hooks/useToasts.ts keeps a list with a 2.4-second timer, and App.tsx renders
  `<ToastStack>` of `<Toast>`. Change: a manager with `timeout={2400}`; `toast(msg)` becomes
  `toast.add({ title: msg })`; useToasts.ts goes.
- Select: 8 uses, each with `value`, `onChange={(e) => ...(e.target.value)}`, `options` and a
  `className` for its size: TaskModal.tsx (in a FormRow, with an empty-string "no project"
  option), settings/ClientsSection.tsx, UsersSection.tsx, GeneralSection.tsx, TasksSection.tsx,
  ProjectsSection.tsx, and views/InvoiceView.tsx (2). Change: the parts as above, or the
  `OptionSelect` wrapper. The size classes (`st.small`, `iv.sel170`, `iv.sel130`, `st.langSelect`)
  go on SelectTrigger. Their doubled selectors (`.small.small`) still win over `select-trigger`.
