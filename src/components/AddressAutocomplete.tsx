'use client';

import React, { useRef, useState, useCallback, memo } from 'react';
import { useGooglePlaces } from '../hooks/useGooglePlaces';
import type { AddressData } from '../types/GooglePlacesTypes';
import { MapPin, Loader2 } from 'lucide-react';

interface AddressAutocompleteProps {
  value?: string;
  onChange: (addressData: AddressData) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  autoFocus?: boolean;
  readOnly?: boolean;
}

const AddressAutocomplete = memo(function AddressAutocomplete({
  value = '',
  onChange,
  error,
  placeholder = 'Enter your property address',
  required = false,
  disabled = false,
  className = '',
  autoFocus = false,
  readOnly = false,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [hasSelected, setHasSelected] = useState(false);

  // Handle address selection from Google Places
  const handleAddressSelect = useCallback(async (addressData: AddressData) => {
    setIsProcessing(true);
    
    try {
      // Validate required fields
      if (!addressData.streetNumber || !addressData.street || !addressData.city || 
          !addressData.state || !addressData.postalCode) {
        throw new Error('Please select a complete address from the dropdown');
      }

      setLocalValue(addressData.formattedAddress);
      setHasSelected(true);
      onChange(addressData);
    } catch (err) {
      console.error('Error processing address:', err);
      // Reset on error
      setHasSelected(false);
    } finally {
      setIsProcessing(false);
    }
  }, [onChange]);

  // Initialize Google Places autocomplete
  useGooglePlaces(inputRef, handleAddressSelect, readOnly || disabled);

  // Handle manual input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
    setHasSelected(false);
  }, []);

  // Handle blur to check if valid address was selected
  const handleBlur = useCallback(() => {
    if (localValue && !hasSelected && !readOnly) {
      // User typed but didn't select from dropdown
      // You might want to show a validation message here
    }
  }, [localValue, hasSelected, readOnly]);

  if (readOnly) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <div className="w-full pl-10 pr-4 py-3 text-lg border rounded-lg bg-gray-50">
            {value || 'No address provided'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className={`h-5 w-5 ${error ? 'text-red-400' : 'text-gray-400'}`} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled || isProcessing}
          autoFocus={autoFocus}
          className={`
            w-full pl-10 pr-10 py-3 text-lg border rounded-lg
            focus:ring-2 focus:ring-primary focus:border-transparent
            outline-none transition-all
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          `}
          aria-label="Property address"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'address-error' : hasSelected ? 'address-success' : undefined}
          autoComplete="street-address"
        />
        
        {isProcessing && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        )}
      </div>
      
      {error && (
        <p id="address-error" className="text-sm text-red-600">
          {error}
        </p>
      )}
      
      {hasSelected && !error && (
        <p id="address-success" className="text-sm text-green-600">
          Address verified
        </p>
      )}
      
      {!hasSelected && localValue && !error && (
        <p className="text-xs text-gray-500">
          Please select an address from the dropdown
        </p>
      )}
    </div>
  );
});

export default AddressAutocomplete;