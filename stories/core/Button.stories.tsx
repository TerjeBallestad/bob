import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../src';


export default {
  title: 'Core/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'accent', 'danger', 'danger-ghost'],
      description: 'How much the button stands out. One `primary` per view; `danger` only for an action that destroys data.',
    },
    size: { control: 'inline-radio', options: ['md', 'sm'], description: '`sm` for toolbars, rows and dense forms; `md` everywhere else.' },
    disabled: { control: 'boolean', description: 'The native attribute. The button leaves the tab order.' },
    children: { control: 'text', description: 'The label: a verb, or a verb and a noun.' },
    className: { control: 'text', description: 'Tailwind utilities that win over Bob\'s classes, for example `px-8`.' },
  },
} satisfies Meta<typeof Button>;

export const Default: StoryObj<typeof Button> = {
  render: (args) => <Button {...args} />,
  args: { variant: 'primary', size: 'md', children: 'Save', disabled: false },
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
