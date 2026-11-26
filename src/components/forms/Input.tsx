import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...rest }: InputProps) {
  return <input type="text" className={['input', className].filter(Boolean).join(' ')} {...rest} />;
}
