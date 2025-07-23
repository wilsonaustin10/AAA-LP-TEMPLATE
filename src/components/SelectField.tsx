'use client';

import React, { memo } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface SelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  name: string;
}

const SelectField = memo(function SelectField({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  error,
  required = false,
  disabled = false,
  className = '',
  name,
}: SelectFieldProps) {
  return (
    <div className={`relative ${className}`}>
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        className={`
          w-full appearance-none px-4 py-3 pr-10 text-lg border rounded-lg
          focus:ring-2 focus:ring-primary focus:border-transparent
          outline-none transition-all
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          ${!value ? 'text-gray-400' : 'text-gray-900'}
        `}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <ChevronDown className={`h-5 w-5 ${error ? 'text-red-400' : 'text-gray-400'}`} />
      </div>
      
      {error && (
        <p id={`${name}-error`} className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
      
      {value && options.find(opt => opt.value === value)?.description && (
        <p className="mt-1 text-sm text-gray-600">
          {options.find(opt => opt.value === value)?.description}
        </p>
      )}
    </div>
  );
});

export default SelectField;