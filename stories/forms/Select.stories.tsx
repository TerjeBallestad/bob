import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, waitFor } from 'storybook/test';
import { FormRow, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from '../../src';

const STAGES = [
  { value: 'inbox', label: 'Inbox' },
  { value: 'exploring', label: 'Exploring' },
  { value: 'planned', label: 'Planned' },
  { value: 'done', label: 'Done' },
];

const STAGES_CODE = `const stages = [
  { value: 'inbox', label: 'Inbox' },
  { value: 'exploring', label: 'Exploring' },
  { value: 'planned', label: 'Planned' },
  { value: 'done', label: 'Done' },
];`;

export default {
  title: 'Forms/Select',
  component: Select,
  subcomponents: { SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel, SelectSeparator },
  argTypes: {
    items: { control: 'object', description: 'The items as `{ value, label }`, so the trigger shows the chosen label. Without it the trigger shows the raw value.' },
    defaultValue: { control: 'text', description: 'The first value, when Select keeps its own state.' },
    value: { control: 'text', description: 'The value, when the parent keeps the state. Set it in onValueChange.' },
    onValueChange: { description: 'Called with the chosen item\'s value, and Base UI\'s event details.' },
    disabled: { control: 'boolean', description: 'The trigger takes no focus and does not open.' },
    name: { control: 'text', description: 'The field name in a form: Select submits its value in a hidden input.' },
    required: { control: 'boolean', description: 'A form does not submit with no value.' },
  },
} satisfies Meta<typeof Select>;

export const Default: StoryObj<typeof Select> = {
  parameters: {
    docs: {
      source: {
        code: `${STAGES_CODE}

<Select items={stages} defaultValue="inbox">
  <SelectTrigger aria-label="Stage">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    {stages.map((s) => (
      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
    ))}
  </SelectContent>
</Select>`,
      },
    },
  },
  render: (args) => (
    <div className="w-60">
      <Select {...args}>
        <SelectTrigger aria-label="Stage">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STAGES.map((s) => (
            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
  args: { items: STAGES, defaultValue: 'inbox' },
};

/** The list, open. It opens over the trigger, with the chosen item on the trigger's value. */
export const Open: StoryObj = {
  name: 'Open list',
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        code: `<Select items={stages} defaultValue="planned">
  <SelectTrigger aria-label="Stage">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    {stages.map((s) => (
      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
    ))}
  </SelectContent>
</Select>`,
      },
    },
  },
  render: () => (
    <div className="w-60 pt-24">
      <Select items={STAGES} defaultValue="planned" defaultOpen>
        <SelectTrigger aria-label="Stage">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STAGES.map((s) => (
            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
};

const PEOPLE = [
  { value: 'ada', label: 'Ada' },
  { value: 'grace', label: 'Grace' },
  { value: 'builder', label: 'Builder' },
  { value: 'reviewer', label: 'Reviewer' },
];

/** Groups with a label each, a separator, a disabled item, and a placeholder before a choice. */
export const Groups: StoryObj = {
  name: 'Groups and placeholder',
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        code: `<Select items={people}>
  <SelectTrigger aria-label="Assignee">
    <SelectValue placeholder="Nobody" />
  </SelectTrigger>
  <SelectContent alignItemWithTrigger={false}>
    <SelectGroup>
      <SelectLabel>People</SelectLabel>
      <SelectItem value="ada">Ada</SelectItem>
      <SelectItem value="grace">Grace</SelectItem>
    </SelectGroup>
    <SelectSeparator />
    <SelectGroup>
      <SelectLabel>Bots</SelectLabel>
      <SelectItem value="builder">Builder</SelectItem>
      <SelectItem value="reviewer" disabled>Reviewer</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>`,
      },
    },
  },
  render: () => (
    <div className="w-60">
      <Select items={PEOPLE} defaultOpen>
        <SelectTrigger aria-label="Assignee">
          <SelectValue placeholder="Nobody" />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          <SelectGroup>
            <SelectLabel>People</SelectLabel>
            <SelectItem value="ada">Ada</SelectItem>
            <SelectItem value="grace">Grace</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Bots</SelectLabel>
            <SelectItem value="builder">Builder</SelectItem>
            <SelectItem value="reviewer" disabled>Reviewer</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};

/** An interaction test: a FormRow label names the trigger, and a choice by pointer or by keyboard reaches onValueChange. */
export const ChooseAnOption: StoryObj<typeof Select> = {
  name: 'Choose an option (test)',
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        code: `const [stage, setStage] = useState('inbox');

<FormRow label="Stage">
  <Select items={stages} value={stage} onValueChange={(v) => v !== null && setStage(v)}>
    <SelectTrigger>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {stages.map((s) => (
        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
      ))}
    </SelectContent>
  </Select>
</FormRow>`,
      },
    },
  },
  args: { onValueChange: fn() },
  render: (args) => (
    <div className="w-60">
      <FormRow label="Stage">
        <Select items={STAGES} defaultValue="inbox" onValueChange={args.onValueChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STAGES.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormRow>
    </div>
  ),
  play: async ({ args, canvas, userEvent }) => {
    // The FormRow label names the trigger, a combobox that shows the chosen label.
    const trigger = canvas.getByRole('combobox', { name: 'Stage' });
    await expect(trigger).toHaveTextContent('Inbox');

    // By pointer. The list is in a portal at the end of <body>, so the test searches the page.
    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole('option', { name: 'Planned' }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith('planned', expect.anything());
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    await expect(trigger).toHaveTextContent('Planned');
    await waitFor(() => expect(trigger).toHaveFocus());

    // By keyboard: Enter opens the list, a letter jumps to an item, Enter chooses it.
    await userEvent.keyboard('{Enter}');
    await screen.findByRole('listbox');
    await userEvent.keyboard('d');
    await waitFor(() => expect(screen.getByRole('option', { name: 'Done' })).toHaveFocus());
    await userEvent.keyboard('{Enter}');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('done', expect.anything());
    await waitFor(() => expect(trigger).toHaveTextContent('Done'));
    await expect(args.onValueChange).toHaveBeenCalledTimes(2);
  },
};
