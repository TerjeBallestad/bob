import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input, SearchInput, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from '../../src';
import { StateGrid, cells } from '../shared/StateGrid';

// Each field in each state, in one screenshot. Focus is forced with
// storybook-addon-pseudo-states; error is aria-invalid="true".
export default { title: 'Forms/States', tags: ['!autodocs'] } satisfies Meta;

const FIELDS = ['input', 'select', 'textarea', 'search'] as const;

// The grid is a test fixture, so the code block shows the states as an app writes them.
export const Fields: StoryObj = {
  parameters: {
    pseudo: { focus: cells(FIELDS, 'focus'), focusVisible: cells(FIELDS, 'focus') },
    docs: {
      source: {
        code: `<Input placeholder="Project name" />
<Input placeholder="Project name" aria-invalid="true" />
<Input placeholder="Project name" disabled />`,
      },
    },
  },
  render: () => (
    <StateGrid
      states={['rest', 'focus', 'error', 'disabled']}
      rows={FIELDS}
      width={150}
      cell={(f, s) => {
        const p = { 'aria-label': `${f} ${s}`, 'aria-invalid': s === 'error' || undefined, disabled: s === 'disabled' };
        if (f === 'input') return <Input {...p} placeholder="Project name" />;
        if (f === 'select')
          return (
            <Select defaultValue="inbox" disabled={p.disabled}>
              <SelectTrigger aria-label={p['aria-label']} aria-invalid={p['aria-invalid']}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inbox">inbox</SelectItem>
                <SelectItem value="planned">planned</SelectItem>
              </SelectContent>
            </Select>
          );
        if (f === 'textarea') return <Textarea {...p} rows={2} defaultValue="Notes" />;
        return <SearchInput {...p} placeholder="Search" />;
      }}
    />
  ),
};

export const SearchKeyHint: StoryObj = {
  name: 'SearchInput key hint',
  parameters: {
    pseudo: { hover: cells(['kbd'], 'hover'), focusVisible: cells(['kbd'], 'focus') },
    docs: { source: { code: '<SearchInput kbd="/" placeholder="Search" onClick={openPalette} />' } },
  },
  render: () => (
    <StateGrid states={['rest', 'hover', 'focus']} rows={['kbd']} width={180} cell={() => <SearchInput kbd="/" placeholder="Search" />} />
  ),
};
