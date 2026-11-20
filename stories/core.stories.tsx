import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, Button, Chip, Kbd, ProgressBar, SegToggle, StatusDot } from '../src';

const row = { display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' } as const;

export default { title: 'Core' } satisfies Meta;

export const ButtonStory: StoryObj<typeof Button> = {
  name: 'Button',
  render: (args) => <Button {...args} />,
  args: { variant: 'primary', size: 'md', children: 'Save', disabled: false },
  argTypes: { variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'accent', 'danger', 'danger-ghost'] } },
};

export const ButtonVariants: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 10 }}>
      {(['md', 'sm'] as const).map((size) => (
        <div key={size} style={row}>
          {(['primary', 'secondary', 'ghost', 'accent', 'danger', 'danger-ghost'] as const).map((v) => (
            <Button key={v} variant={v} size={size}>{v}</Button>
          ))}
          <Button size={size} disabled>disabled</Button>
        </div>
      ))}
    </div>
  ),
};

export const ChipStory: StoryObj<typeof Chip> = {
  name: 'Chip',
  render: (args) => <Chip {...args} />,
  args: { tone: 'green', mono: true, children: 'admin' },
};

export const ChipTones: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 10 }}>
      {[false, true].map((mono) => (
        <div key={String(mono)} style={row}>
          {(['neutral', 'accent', 'blue', 'green', 'orange', 'danger', 'yellow', 'claim'] as const).map((t) => (
            <Chip key={t} tone={t} mono={mono}>{t}</Chip>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const AvatarStory: StoryObj<typeof Avatar> = {
  name: 'Avatar',
  render: () => (
    <div style={row}>
      {(['gold', 'accent', 'green', 'neutral'] as const).map((t) => <Avatar key={t} tone={t} initials="TB" />)}
      <Avatar initials="TB" size={32} />
    </div>
  ),
};

export const KbdStory: StoryObj<typeof Kbd> = {
  name: 'Kbd',
  render: () => <div style={row}><Kbd>⌘K</Kbd><Kbd>/</Kbd><Kbd>Esc</Kbd></div>,
};

export const ProgressBarStory: StoryObj<typeof ProgressBar> = {
  name: 'ProgressBar',
  render: (args) => <ProgressBar {...args} />,
  args: { value: 3, max: 7, width: 160 },
};

export const SegToggleStory: StoryObj<typeof SegToggle> = {
  name: 'SegToggle',
  render: (args) => <SegToggle {...args} />,
  args: { options: ['day', 'week', 'month'], value: 'week' },
};

export const StatusDotStory: StoryObj<typeof StatusDot> = {
  name: 'StatusDot',
  render: () => (
    <div style={row}>
      {(['dashed', 'outline', 'staged', 'live', 'solid'] as const).map((s) => (
        <StatusDot key={s} state={s} color="var(--green)" size={9} />
      ))}
      <StatusDot state="solid" square color="var(--accent)" size={9} />
    </div>
  ),
};
