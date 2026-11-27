import React from 'react';
import { Select as SelectPrimitive } from '@base-ui/react/select';

// Built on Base UI's Select, from shadcn/ui's Base UI select (DD-034, DD-036). Base UI does the
// behaviour: the trigger is a combobox button, the list is a listbox, and Base UI gives it its
// keys (Enter, Space and the arrows open it, the arrows move, a letter jumps by typeahead,
// Escape closes it and gives focus back to the trigger), its portal and its position. The API
// is Base UI's: value or defaultValue, onValueChange(value), and the items as children.
// The styles are Bob's classes in src/tailwind/forms.css (DD-031).

export type SelectProps<Value = string, Multiple extends boolean | undefined = false> = SelectPrimitive.Root.Props<Value, Multiple>;

/** The select's state: value or defaultValue, onValueChange, items, name, disabled, required.
 *  Pass `items` (`{ value, label }[]`) so the trigger shows the chosen item's label; without it
 *  the trigger shows the raw value. Renders no element of its own. An `id` goes to the trigger,
 *  so FormRow's label names it. */
// A function, not `const Select = SelectPrimitive.Root`: a property read at the top of the
// module keeps Base UI's Select in every app bundle, also one that imports only Button.
function Select<Value, Multiple extends boolean | undefined = false>(props: SelectProps<Value, Multiple>) {
  return <SelectPrimitive.Root {...props} />;
}

export interface SelectTriggerProps extends SelectPrimitive.Trigger.Props {}

/** The button that shows the value and opens the list. An error is `aria-invalid="true"` on
 *  it, as on Input; `aria-describedby` points at the error text. */
function SelectTrigger({ className, children, ...props }: SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger className={join('select-trigger', className)} {...props}>
      {children}
      <SelectPrimitive.Icon className="select-icon">
        <Chevron />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export interface SelectValueProps extends SelectPrimitive.Value.Props {}

/** The chosen item's label in the trigger, or `placeholder` when there is no value. */
function SelectValue({ className, ...props }: SelectValueProps) {
  return <SelectPrimitive.Value className={join('select-value', className)} {...props} />;
}

export interface SelectContentProps
  extends SelectPrimitive.Popup.Props,
    Pick<SelectPrimitive.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset' | 'alignItemWithTrigger'> {}

/** The list, in a portal at the end of `<body>`. It opens over the trigger, with the chosen
 *  item on the trigger's value (Base UI's alignItemWithTrigger); `alignItemWithTrigger={false}`
 *  opens it below the trigger. */
function SelectContent({
  className,
  children,
  side = 'bottom',
  sideOffset = 4,
  align = 'center',
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}: SelectContentProps) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="select-positioner"
      >
        <SelectPrimitive.Popup className={join('select-popup', className)} {...props}>
          <SelectPrimitive.ScrollUpArrow className="select-scroll-arrow select-scroll-up">
            <Chevron up />
          </SelectPrimitive.ScrollUpArrow>
          <SelectPrimitive.List className="select-list">{children}</SelectPrimitive.List>
          <SelectPrimitive.ScrollDownArrow className="select-scroll-arrow select-scroll-down">
            <Chevron />
          </SelectPrimitive.ScrollDownArrow>
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

export interface SelectItemProps extends SelectPrimitive.Item.Props {}

/** One option: `value` is what onValueChange gets, the children are its label. */
function SelectItem({ className, children, ...props }: SelectItemProps) {
  return (
    <SelectPrimitive.Item className={join('select-item', className)} {...props}>
      <SelectPrimitive.ItemText className="select-item-text">{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="select-item-indicator">
        <Check />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

export interface SelectGroupProps extends SelectPrimitive.Group.Props {}

/** Items under one SelectLabel. */
function SelectGroup({ className, ...props }: SelectGroupProps) {
  return <SelectPrimitive.Group className={join('select-group', className)} {...props} />;
}

export interface SelectLabelProps extends SelectPrimitive.GroupLabel.Props {}

/** The heading of a SelectGroup. It names the group; it is not an item. */
function SelectLabel({ className, ...props }: SelectLabelProps) {
  return <SelectPrimitive.GroupLabel className={join('select-label', className)} {...props} />;
}

export interface SelectSeparatorProps extends SelectPrimitive.Separator.Props {}

/** A line between items or groups. */
function SelectSeparator({ className, ...props }: SelectSeparatorProps) {
  return <SelectPrimitive.Separator className={join('select-separator', className)} {...props} />;
}

// Base UI's className may be a function of the part's state. Bob's class comes first, and an
// app's utilities after it.
function join<S>(bob: string, className: string | ((state: S) => string | undefined) | undefined) {
  if (typeof className === 'function') return (state: S) => [bob, className(state)].filter(Boolean).join(' ');
  return className ? `${bob} ${className}` : bob;
}

function Chevron({ up = false }: { up?: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d={up ? 'M4 10l4-4 4 4' : 'M4 6l4 4 4-4'} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Check() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M3 8.5l3.5 3.5L13 4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue };
