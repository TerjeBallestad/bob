import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { FormRow, Select } from '../../src';

export default {
  title: 'Forms/Select',
  component: Select,
  argTypes: {
    options: { control: 'object', description: 'The choices. A string is shorthand for `{ value, label }` with both the same.' },
    value: { control: 'text', description: 'Controlled value. Pass `defaultValue` instead to let the browser keep it.' },
    onChange: { description: 'The native change event: read `e.target.value`.' },
    disabled: { control: 'boolean', description: 'The native attribute.' },
    className: { control: 'text', description: 'Tailwind utilities that win over Bob\'s classes.' },
  },
} satisfies Meta<typeof Select>;

export const Default: StoryObj<typeof Select> = {
  render: (args) => <Select {...args} />,
  args: { options: ['inbox', 'exploring', 'planned', { value: 'done', label: 'Done' }], 'aria-label': 'Stage' },
};

/** An interaction test: Tab reaches the select, and a choice by value or by label reaches onChange. */
export const ChooseAnOption: StoryObj<typeof Select> = {
  name: 'Choose an option (test)',
  parameters: { controls: { disable: true } },
  args: { onChange: fn() },
  render: (args) => (
    <div style={{ width: 240 }}>
      <FormRow label="Stage">
        <Select aria-label="Stage" defaultValue="inbox" options={['inbox', 'planned', { value: 'done', label: 'Done' }]} onChange={args.onChange} />
      </FormRow>
    </div>
  ),
  play: async ({ args, canvas, userEvent }) => {
    const select = canvas.getByRole('combobox', { name: 'Stage' });
    await expect(select).toHaveValue('inbox');
    await userEvent.tab();
    await expect(select).toHaveFocus();
    await userEvent.selectOptions(select, 'planned');
    await expect(select).toHaveValue('planned');
    // An option object shows its label and submits its value.
    await userEvent.selectOptions(select, 'Done');
    await expect(select).toHaveValue('done');
    await expect(args.onChange).toHaveBeenCalledTimes(2);
  },
};
