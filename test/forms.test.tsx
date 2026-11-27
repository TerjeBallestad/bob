// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import * as Bob from '@terjeballestad/bob';

// Select with FormRow and Input, from the built package (DD-036). The keyboard is tested in a
// real browser (visual/keyboard.visual.ts); this checks the wiring of label, error and form.
function render(element: JSX.Element) {
  const host = document.body.appendChild(document.createElement('div'));
  const root = createRoot(host);
  act(() => root.render(element));
  return { host, done: () => (act(() => root.unmount()), host.remove()) };
}

const stage = (props: Partial<Bob.SelectTriggerProps> = {}, root: Partial<Bob.SelectProps> = {}) => (
  <Bob.Select items={[{ value: 'inbox', label: 'Inbox' }, { value: 'done', label: 'Done' }]} defaultValue="inbox" {...root}>
    <Bob.SelectTrigger {...props}>
      <Bob.SelectValue />
    </Bob.SelectTrigger>
    <Bob.SelectContent>
      <Bob.SelectItem value="inbox">Inbox</Bob.SelectItem>
      <Bob.SelectItem value="done">Done</Bob.SelectItem>
    </Bob.SelectContent>
  </Bob.Select>
);

describe('Select in a form', () => {
  it('a FormRow label names the trigger: the id FormRow gives Select lands on the trigger', () => {
    const { host, done } = render(<Bob.FormRow label="Stage">{stage()}</Bob.FormRow>);
    const label = host.querySelector('label')!;
    const trigger = host.querySelector('[role="combobox"]')!;
    expect(label.htmlFor).toBeTruthy();
    expect(trigger.id).toBe(label.htmlFor);
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger.textContent).toBe('Inbox');
    done();
  });

  it('aria-invalid and aria-describedby on the trigger reach the button, as on Input', () => {
    const { host, done } = render(
      <>
        {stage({ 'aria-invalid': true, 'aria-describedby': 'stage-error' })}
        <Bob.Input aria-invalid aria-describedby="name-error" />
      </>,
    );
    const trigger = host.querySelector('[role="combobox"]')!;
    expect(trigger.getAttribute('aria-invalid')).toBe('true');
    expect(trigger.getAttribute('aria-describedby')).toBe('stage-error');
    expect(trigger.className).toBe('select-trigger');
    expect(host.querySelector('input.input')!.getAttribute('aria-invalid')).toBe('true');
    done();
  });

  it('name puts the value in a hidden input, so a form submits it', () => {
    const { host, done } = render(<form>{stage({}, { name: 'stage' })}</form>);
    const data = new FormData(host.querySelector('form')!);
    expect(data.get('stage')).toBe('inbox');
    done();
  });

  it('disabled reaches the trigger, and an app class comes after Bob\'s', () => {
    const { host, done } = render(stage({ className: 'w-40' }, { disabled: true }));
    const trigger = host.querySelector('[role="combobox"]')!;
    expect(trigger.hasAttribute('data-disabled')).toBe(true);
    expect(trigger.className).toBe('select-trigger w-40');
    done();
  });
});
