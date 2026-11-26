import * as Bob from '@terjeballestad/bob';

// One render of each component, from the built package. render.test.tsx checks that the list
// covers every component; tailwind.test.ts builds Bob's classes for them in a Tailwind app.
export const samples: Record<string, () => JSX.Element> = {
  Avatar: () => <Bob.Avatar initials="TB" />,
  Button: () => <Bob.Button variant="secondary" size="sm">Save</Bob.Button>,
  Chip: () => <Bob.Chip mono tone="green">admin</Bob.Chip>,
  Kbd: () => <Bob.Kbd>⌘K</Bob.Kbd>,
  ProgressBar: () => <Bob.ProgressBar value={3} max={7} />,
  SegToggle: () => <Bob.SegToggle options={['day', 'week']} value="day" />,
  StatusDot: () => <Bob.StatusDot state="live" />,
  FormRow: () => <Bob.FormRow label="Name"><Bob.Input /></Bob.FormRow>,
  Input: () => <Bob.Input placeholder="name" />,
  SearchInput: () => <Bob.SearchInput kbd="/" />,
  Select: () => <Bob.Select options={['a', { value: 'b', label: 'B' }]} />,
  Textarea: () => <Bob.Textarea />,
  Modal: () => <Bob.Modal open title="Title">Body</Bob.Modal>,
  Toast: () => <Bob.Toast error>Failed</Bob.Toast>,
  ToastStack: () => <Bob.ToastStack><Bob.Toast>Saved</Bob.Toast></Bob.ToastStack>,
  ListRow: () => <Bob.ListRow id="SB-042" title="A ticket" />,
  NavRow: () => <Bob.NavRow label="Inbox" count={3} active />,
  SectionLabel: () => <Bob.SectionLabel>Planned</Bob.SectionLabel>,
  TicketCard: () => <Bob.TicketCard id="SB-042" title="A ticket" progress={{ done: 1, total: 3 }} />,
};
