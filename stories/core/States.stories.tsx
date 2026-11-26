import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, SegToggle } from '../../src';
import { StateGrid, cells } from '../shared/StateGrid';

// Each control in each state, in one screenshot. Hover and keyboard focus are forced with
// storybook-addon-pseudo-states (the `pseudo` parameter), so the screenshot test needs no mouse.
export default { title: 'Core/States', tags: ['!autodocs'] } satisfies Meta;

const BUTTONS = ['primary', 'secondary', 'ghost', 'accent', 'danger', 'danger-ghost'] as const;

export const Buttons: StoryObj = {
  parameters: { pseudo: { hover: cells(BUTTONS, 'hover'), focusVisible: cells(BUTTONS, 'focus') } },
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

export const SegToggleFocus: StoryObj = {
  name: 'SegToggle focus',
  parameters: { pseudo: { focusVisible: ['#seg-focus button:first-child', '#seg-focus-active button:nth-child(2)'] } },
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <div id="seg-focus">
        <SegToggle options={['day', 'week', 'month']} value="week" />
      </div>
      <div id="seg-focus-active">
        <SegToggle options={['day', 'week', 'month']} value="week" />
      </div>
    </div>
  ),
};
