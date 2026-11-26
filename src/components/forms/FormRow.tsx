import React from 'react';

export interface FormRowProps {
  label?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/** A label above one control. With one element child, the label names it (htmlFor and the
 *  child's id, its own id if it has one), so a click on the label focuses it and a screen reader
 *  reads the label. */
export function FormRow({ label, children, style }: FormRowProps) {
  const generated = React.useId();
  const only = React.Children.count(children) === 1 && React.isValidElement<{ id?: string }>(children) ? children : null;
  const id = only ? only.props.id ?? generated : undefined;
  return (
    <div className="form-row" style={style}>
      {label && (
        <label className="form-label" htmlFor={id}>
          {label}
        </label>
      )}
      {only && id !== only.props.id ? React.cloneElement(only, { id }) : children}
    </div>
  );
}
