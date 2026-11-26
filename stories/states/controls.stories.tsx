import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Input, NavRow, SearchInput, SegToggle, Select, Textarea } from '../../src';
import { StateGrid, cells } from './states';

// Each control in each state, in one screenshot. Hover and keyboard focus are forced with
// storybook-addon-pseudo-states (the `pseudo` parameter), so the screenshot test needs no mouse.
export default { title: 'States/Controls', tags: ['!autodocs'] } satisfies Meta;

const BUTTONS = ['primary', 'secondary', 'ghost', 'accent', 'danger', 'danger-ghost'] as const;
const BUTTON_STATES = ['rest', 'hover', 'focus', 'disabled'] as const;

export const Buttons: StoryObj = {
  parameters: { pseudo: { hover: cells(BUTTONS, 'hover'), focusVisible: cells(BUTTONS, 'focus') } },
  render: () => (
    <StateGrid
      states={BUTTON_STATES}
      rows={BUTTONS}
      cell={(v, s) => (
        <Button variant={v as (typeof BUTTONS)[number]} disabled={s === 'disabled'}>
          Save
        </Button>
      )}
    />
  ),
};

const FIELDS = ['input', 'select', 'textarea', 'search'] as const;
const FIELD_STATES = ['rest', 'focus', 'error', 'disabled'] as const;

export const Fields: StoryObj = {
  parameters: {
    pseudo: { focus: cells(FIELDS, 'focus'), focusVisible: cells(FIELDS, 'focus') },
  },
  render: () => (
    <StateGrid
      states={FIELD_STATES}
      rows={FIELDS}
      width={150}
      cell={(f, s) => {
        const p = { 'aria-label': `${f} ${s}`, 'aria-invalid': s === 'error' || undefined, disabled: s === 'disabled' };
        if (f === 'input') return <Input {...p} placeholder="Project name" />;
        if (f === 'select') return <Select {...p} options={['inbox', 'planned']} />;
        if (f === 'textarea') return <Textarea {...p} rows={2} defaultValue="Notes" />;
        return <SearchInput {...p} placeholder="Search" />;
      }}
    />
  ),
};

const NAV = ['nav-row', 'nav-active', 'search-kbd'] as const;
const NAV_STATES = ['rest', 'hover', 'focus'] as const;

export const Navigation: StoryObj = {
  parameters: { pseudo: { hover: cells(NAV, 'hover'), focusVisible: cells(NAV, 'focus') } },
  render: () => (
    <StateGrid
      states={NAV_STATES}
      rows={NAV}
      width={180}
      cell={(r) =>
        r === 'search-kbd' ? (
          <SearchInput kbd="/" placeholder="Search" />
        ) : (
          <NavRow label="Inbox" count={12} active={r === 'nav-active'} />
        )
      }
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
