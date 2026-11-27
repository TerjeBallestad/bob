import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../src';

export default {
  title: 'Core/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'accent', 'danger', 'danger-ghost', 'text'],
      description: 'How much the button stands out. One `primary` per view; `danger` only for an action that destroys data; `text` for an action that reads as text.',
    },
    size: { control: 'inline-radio', options: ['md', 'sm'], description: '`sm` for toolbars, rows and dense forms; `md` everywhere else. `text` ignores it.' },
    disabled: { control: 'boolean', description: 'The native attribute. The button leaves the tab order.' },
    children: { control: 'text', description: 'The label: a verb, or a verb and a noun.' },
    className: { control: 'text', description: 'Tailwind utilities that win over Bob\'s classes, for example `px-8`.' },
  },
} satisfies Meta<typeof Button>;

export const Default: StoryObj<typeof Button> = {
  render: (args) => <Button {...args} />,
  args: { variant: 'primary', children: 'Save' },
};

export const Variants: StoryObj = {
  render: () => (
    <div className="grid gap-2.5">
      <div className="flex flex-wrap items-center gap-2.5">
        <Button variant="primary">primary</Button>
        <Button variant="secondary">secondary</Button>
        <Button variant="ghost">ghost</Button>
        <Button variant="accent">accent</Button>
        <Button variant="danger">danger</Button>
        <Button variant="danger-ghost">danger-ghost</Button>
        <Button disabled>disabled</Button>
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        <Button variant="primary" size="sm">primary</Button>
        <Button variant="secondary" size="sm">secondary</Button>
        <Button variant="ghost" size="sm">ghost</Button>
        <Button variant="accent" size="sm">accent</Button>
        <Button variant="danger" size="sm">danger</Button>
        <Button variant="danger-ghost" size="sm">danger-ghost</Button>
        <Button size="sm" disabled>disabled</Button>
      </div>
    </div>
  ),
};

// The text variant where an app puts it: in a top bar, under a user's name, at the end of a row.
// It takes its font and colour from the classes beside it.
export const Text: StoryObj = {
  render: () => (
    <div className="grid w-80 gap-3">
      <div className="flex items-center justify-between rounded-btn border border-subtle bg-card px-3 py-2">
        <span className="text-caption text-secondary">Timer running · 0:42</span>
        <Button variant="text" className="text-tiny font-semibold uppercase tracking-label text-danger">stop</Button>
      </div>
      <div className="grid gap-0.5 rounded-btn border border-subtle bg-sidebar px-3 py-2">
        <span className="text-body text-primary">Ada Park</span>
        <Button variant="text" className="justify-self-start text-caption text-muted hover:text-primary">sign out</Button>
      </div>
      <div className="flex items-center justify-between rounded-btn border border-subtle bg-card px-3 py-2">
        <span className="font-mono text-tiny text-secondary">09:00–10:30 · design review</span>
        <Button variant="text" aria-label="Delete entry" className="text-title text-faint hover:text-danger">×</Button>
      </div>
      <div className="flex items-center gap-3 text-caption text-secondary">
        <Button variant="text">inherits</Button>
        <Button variant="text" disabled>disabled</Button>
      </div>
    </div>
  ),
};
