import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, SegToggle } from '../../src';
import { StateGrid, cells } from '../shared/StateGrid';

// Each control in each state, in one screenshot. Hover and keyboard focus are forced with
// storybook-addon-pseudo-states (the `pseudo` parameter), so the screenshot test needs no mouse.
export default { title: 'Core/States', tags: ['!autodocs'] } satisfies Meta;

const BUTTONS = ['primary', 'secondary', 'ghost', 'accent', 'danger', 'danger-ghost'] as const;

// The grid is a test fixture, so the code block shows the states as an app writes them.
export const Buttons: StoryObj = {
  parameters: {
    pseudo: { hover: cells(BUTTONS, 'hover'), focusVisible: cells(BUTTONS, 'focus') },
    docs: { source: { code: '<Button variant="primary">Save</Button>\n<Button variant="primary" disabled>Save</Button>' } },
  },
  render: () => (
    <StateGrid
      states={['rest', 'hover', 'focus', 'disabled']}
      rows={BUTTONS}
      cell={(v, s) => (
        <Button variant={v as (typeof BUTTONS)[number]} disabled={s === 'disabled'}>
          Save
        </Button>
      )}
    />
  ),
};

// The text variant has no fill or border to change, so hover is the app's (here hover:text-primary).
// Focus is Bob's ring; disabled is Bob's opacity.
const TEXT_ROWS = ['text'] as const;
export const TextButton: StoryObj = {
  name: 'Text button',
  parameters: {
    pseudo: { hover: cells(TEXT_ROWS, 'hover'), focusVisible: cells(TEXT_ROWS, 'focus') },
    docs: { source: { code: '<Button variant="text" className="text-caption text-muted hover:text-primary">sign out</Button>' } },
  },
  render: () => (
    <StateGrid
      states={['rest', 'hover', 'focus', 'disabled']}
      rows={TEXT_ROWS}
      cell={(_, s) => (
        <Button variant="text" disabled={s === 'disabled'} className="text-caption text-muted hover:text-primary">
          sign out
        </Button>
      )}
    />
  ),
};

export const SegToggleFocus: StoryObj = {
  name: 'SegToggle focus',
  parameters: { pseudo: { focusVisible: ['#seg-focus button:first-child', '#seg-focus-active button:nth-child(2)'] } },
  render: () => (
    <div className="grid gap-3">
      <div id="seg-focus">
        <SegToggle options={['day', 'week', 'month']} value="week" />
      </div>
      <div id="seg-focus-active">
        <SegToggle options={['day', 'week', 'month']} value="week" />
      </div>
    </div>
  ),
};

// SegToggle with no value: no segment is active, and Tab lands on the first one
// (visual/keyboard.visual.ts).
export const SegToggleNoValue: StoryObj = {
  name: 'SegToggle no value',
  render: () => <SegToggle options={['day', 'week', 'month']} />,
};
