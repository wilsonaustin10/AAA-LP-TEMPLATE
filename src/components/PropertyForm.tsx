'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from '../context/FormContext';
import AddressAutocomplete from './AddressAutocomplete';
import PhoneInput from './PhoneInput';
import { Check, Loader2 } from 'lucide-react';
import type { AddressData } from '../types/GooglePlacesTypes';

interface PropertyFormProps {
  onSuccess?: () => void;
  showConsent?: boolean;
  submitButtonText?: string;
  isCompactMode?: boolean;
}

export default function PropertyForm({
  onSuccess,
  showConsent = true,
  submitButtonText = 'Get My Cash Offer',
  isCompactMode = false,
}: PropertyFormProps) {
  const router = useRouter();
  const { 
    formState, 
    updateFormData, 
    errors, 
    setFieldError,
    clearFieldError,
  } = useForm();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Handle field touch for validation
  const handleFieldTouch = useCallback((field: string) => {
    setTouchedFields(prev => new Set([...prev, field]));
  }, []);

  // Handle address selection
  const handleAddressSelect = useCallback((addressData: AddressData) => {
    updateFormData({
      address: addressData.formattedAddress,
      streetAddress: `${addressData.streetNumber} ${addressData.street}`.trim(),
      city: addressData.city,
      state: addressData.state,
      postalCode: addressData.postalCode,
      placeId: addressData.placeId,
    });
    clearFieldError('address');
    handleFieldTouch('address');
  }, [updateFormData, clearFieldError, handleFieldTouch]);

  // Handle phone change
  const handlePhoneChange = useCallback((phone: string) => {
    updateFormData({ phone });
    if (touchedFields.has('phone') && phone.length >= 10) {
      clearFieldError('phone');
    }
  }, [updateFormData, clearFieldError, touchedFields]);

  // Handle phone blur
  const handlePhoneBlur = useCallback(() => {
    handleFieldTouch('phone');
    if (!formState.phone) {
      setFieldError('phone', 'Phone number is required');
    } else if (formState.phone.length < 10) {
      setFieldError('phone', 'Please enter a valid phone number');
    }
  }, [formState.phone, handleFieldTouch, setFieldError]);

  // Handle consent change
  const handleConsentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ consent: e.target.checked });
    if (e.target.checked) {
      clearFieldError('consent');
    }
    handleFieldTouch('consent');
  }, [updateFormData, clearFieldError, handleFieldTouch]);

  // Validate form before submission
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formState.address) {
      newErrors.address = 'Please enter your property address';
    }
    if (!formState.phone || formState.phone.length < 10) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (showConsent && !formState.consent) {
      newErrors.consent = 'Please agree to be contacted';
    }

    Object.entries(newErrors).forEach(([field, error]) => {
      setFieldError(field, error);
    });

    return Object.keys(newErrors).length === 0;
  }, [formState, showConsent, setFieldError]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    ['address', 'phone', 'consent'].forEach(field => handleFieldTouch(field));

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit initial lead data
      const response = await fetch('/api/submit-partial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: formState.address,
          streetAddress: formState.streetAddress,
          city: formState.city,
          state: formState.state,
          postalCode: formState.postalCode,
          phone: formState.phone,
          consent: formState.consent,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      const result = await response.json();
      
      // Update form with lead ID
      updateFormData({ leadId: result.leadId });

      // Track conversion
      if (typeof window !== 'undefined') {
        window.gtag?.('event', 'generate_lead', {
          currency: 'USD',
          value: 0
        });
        window.fbq?.('track', 'Lead');
      }

      // Navigate to next step or call success callback
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/property-details');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setFieldError('form', 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    formState,
    validateForm,
    handleFieldTouch,
    updateFormData,
    setFieldError,
    router,
    onSuccess,
  ]);

  // Memoize form layout class
  const formClass = useMemo(() => 
    isCompactMode 
      ? 'space-y-4' 
      : 'space-y-6',
    [isCompactMode]
  );

  return (
    <form onSubmit={handleSubmit} className={formClass} noValidate>
      <div className="space-y-4">
        <AddressAutocomplete
          value={formState.address}
          onChange={handleAddressSelect}
          error={touchedFields.has('address') ? errors.address : undefined}
          required
          autoFocus
          placeholder="Enter property address"
        />

        <PhoneInput
          value={formState.phone}
          onChange={handlePhoneChange}
          onBlur={handlePhoneBlur}
          error={touchedFields.has('phone') ? errors.phone : undefined}
          required
          placeholder="Your phone number"
        />

        {showConsent && (
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="consent"
                name="consent"
                type="checkbox"
                checked={formState.consent}
                onChange={handleConsentChange}
                className={`
                  h-4 w-4 rounded border-gray-300 
                  text-primary focus:ring-primary
                  ${touchedFields.has('consent') && errors.consent ? 'border-red-500' : ''}
                `}
                required
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="consent" className="text-gray-700">
                I agree to be contacted by {{COMPANY_NAME}} about my property
              </label>
              {touchedFields.has('consent') && errors.consent && (
                <p className="mt-1 text-red-600 text-xs">{errors.consent}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {errors.form && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{errors.form}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`
          w-full px-6 py-4 text-lg font-semibold text-white 
          bg-primary hover:bg-primary-dark rounded-lg
          transition-all duration-200 transform hover:scale-[1.02]
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          ${isCompactMode ? 'py-3' : 'py-4'}
        `}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
            Processing...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            {submitButtonText}
            <Check className="ml-2 h-5 w-5" />
          </span>
        )}
      </button>

      <p className="text-center text-sm text-gray-600">
        No fees, no commissions, no obligation
      </p>
    </form>
  );
}