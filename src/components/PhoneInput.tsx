'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { formatPhoneNumber, normalizePhoneNumber } from '../utils/formatting';
import { validatePhone } from '../utils/validation';
import { Phone } from 'lucide-react';

interface PhoneInputProps {
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  autoFocus?: boolean;
}

export default function PhoneInput({
  value = '',
  onChange,
  onBlur,
  error,
  placeholder = '(555) 123-4567',
  required = false,
  disabled = false,
  className = '',
  autoFocus = false,
}: PhoneInputProps) {
  const [displayValue, setDisplayValue] = useState(formatPhoneNumber(value));
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update display value when prop value changes
  useEffect(() => {
    setDisplayValue(formatPhoneNumber(value));
  }, [value]);

  // Handle input change with formatting
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const cursorPosition = e.target.selectionStart || 0;
    
    // Allow deletion
    if (input.length < displayValue.length) {
      const normalized = normalizePhoneNumber(input);
      onChange(normalized);
      setDisplayValue(formatPhoneNumber(normalized));
      return;
    }
    
    // Extract only digits from new input
    const normalized = normalizePhoneNumber(input);
    
    // Limit to 10 digits for US numbers
    if (normalized.length > 10 && !normalized.startsWith('+')) {
      return;
    }
    
    // Update the value
    const formatted = formatPhoneNumber(normalized);
    setDisplayValue(formatted);
    onChange(normalized);
    
    // Restore cursor position after formatting
    setTimeout(() => {
      if (inputRef.current) {
        // Calculate new cursor position based on formatting
        let newPosition = cursorPosition;
        if (normalized.length >= 3 && cursorPosition > 0) newPosition += 1; // After (
        if (normalized.length >= 3 && cursorPosition > 3) newPosition += 2; // After )
        if (normalized.length >= 6 && cursorPosition > 6) newPosition += 1; // After -
        
        inputRef.current.setSelectionRange(newPosition, newPosition);
      }
    }, 0);
  }, [displayValue, onChange]);

  // Handle paste events
  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const normalized = normalizePhoneNumber(pastedText);
    const formatted = formatPhoneNumber(normalized);
    setDisplayValue(formatted);
    onChange(normalized);
  }, [onChange]);

  // Handle blur event
  const handleBlur = useCallback(() => {
    setIsFocused(false);
    if (onBlur) {
      onBlur();
    }
    
    // Validate on blur
    if (value && !validatePhone(value)) {
      // You can handle validation error here if needed
    }
  }, [value, onBlur]);

  // Handle focus event
  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Phone className={`h-5 w-5 ${error ? 'text-red-400' : 'text-gray-400'}`} />
        </div>
        <input
          ref={inputRef}
          type="tel"
          value={displayValue}
          onChange={handleChange}
          onPaste={handlePaste}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoFocus={autoFocus}
          className={`
            w-full pl-10 pr-4 py-3 text-lg border rounded-lg
            focus:ring-2 focus:ring-primary focus:border-transparent
            outline-none transition-all
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          `}
          aria-label="Phone number"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'phone-error' : undefined}
          autoComplete="tel"
          inputMode="tel"
        />
      </div>
      
      {error && (
        <p id="phone-error" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
      
      {!error && isFocused && (
        <p className="mt-1 text-xs text-gray-500">
          Enter a 10-digit phone number
        </p>
      )}
    </div>
  );
}