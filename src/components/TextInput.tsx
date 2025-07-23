'use client';

import React, { memo } from 'react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  type?: 'text' | 'email' | 'tel' | 'number';
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  name: string;
  autoComplete?: string;
  maxLength?: number;
  pattern?: string;
  icon?: React.ReactNode;
  autoFocus?: boolean;
}

const TextInput = memo(function TextInput({
  value,
  onChange,
  onBlur,
  type = 'text',
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  name,
  autoComplete,
  maxLength,
  pattern,
  icon,
  autoFocus = false,
}: TextInputProps) {
  return (
    <div className={`relative ${className}`}>
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
      
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        maxLength={maxLength}
        pattern={pattern}
        autoFocus={autoFocus}
        className={`
          w-full px-4 py-3 text-lg border rounded-lg
          focus:ring-2 focus:ring-primary focus:border-transparent
          outline-none transition-all
          ${icon ? 'pl-10' : ''}
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
        `}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      
      {error && (
        <p id={`${name}-error`} className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});

export default TextInput;