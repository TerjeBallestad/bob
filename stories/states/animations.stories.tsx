import type { Meta, StoryObj } from '@storybook/react-vite';
import { TicketCard } from '../../src';
import { STATE_LABEL } from './states';
import './animations.css';

// Bob's live pulse next to Tailwind's two built-in loops, on the TicketCard dot, for Terje to
// choose (PLAN-005 TASK-032). Bob keeps animate-live until he does. With reduced motion on,
// none of the three moves, and the screenshot test shows them still.
export default { title: 'Animations', tags: ['!autodocs'] } satisfies Meta;

const OPTIONS = [
  { cls: '', name: "Bob's animate-live", note: 'opacity 1 → 0.45, 1.8s ease-in-out' },
  { cls: 'live-tw-pulse', name: "Tailwind's animate-pulse", note: 'opacity 1 → 0.5, 2s cubic-bezier(0.4, 0, 0.6, 1)' },
  { cls: 'live-tw-ping', name: "Tailwind's animate-ping", note: 'a copy scales to 2× and fades, 1s; the dot stays' },
];

export const LiveDot: StoryObj = {
  name: 'Live dot',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 220px)', gap: 16 }}>
      {OPTIONS.map((o) => (
        <div key={o.name} className={o.cls} style={{ display: 'grid', gap: 8 }}>
          <span style={{ ...STATE_LABEL, color: 'var(--text)' }}>{o.name}</span>
          <TicketCard id="SB-042" kind="task" title="An agent works on this ticket" age="2m" live />
          <span style={STATE_LABEL}>{o.note}</span>
        </div>
      ))}
    </div>
  ),
};
