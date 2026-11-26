import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../src';

const VARIANTS = ['primary', 'secondary', 'ghost', 'accent', 'danger', 'danger-ghost'] as const;
const row = { display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' } as const;

export default {
  title: 'Core/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: VARIANTS,
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
    <div style={{ display: 'grid', gap: 10 }}>
      {(['md', 'sm'] as const).map((size) => (
        <div key={size} style={row}>
          {VARIANTS.map((v) => (
            <Button key={v} variant={v} size={size}>{v}</Button>
          ))}
          <Button size={size} disabled>disabled</Button>
        </div>
      ))}
    </div>
  ),
};
