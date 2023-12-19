import clsx from 'clsx';
import * as React from 'react';

export interface InputProps {
  id: string;
  name?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  className?: string;
  onChange?: (event: React.FormEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FormEvent<HTMLInputElement>) => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      name,
      type = 'input',
      placeholder,
      value,
      required = false,
      disabled = false,
      readOnly = false,
      maxLength,
      className,
      onChange,
      onBlur,
    },
    ref
  ) => {
    return (
      <input
        ref={ref}
        onChange={onChange}
        onBlur={onBlur}
        type={type}
        id={id}
        name={name ?? id}
        value={value}
        maxLength={maxLength}
        className={clsx(
          className,
          'bg-slate-700',
          'text-white/[0.8]',
          'placeholder-white/[0.3]',
          'rounded-lg',
          'focus:ring-2',
          'focus:outline-none',
          'focus:ring-sky-600',
          'focus:border-sky-600',
          'block',
          'w-full',
          'py-2 px-3'
        )}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
