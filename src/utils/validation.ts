/**
 * Validation utilities for form fields
 */

// Phone validation - accepts various formats
export const validatePhone = (phone: string): boolean => {
  // Remove all non-digit characters for validation
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it's a valid US phone number (10 digits)
  // or international format (10-15 digits)
  return cleaned.length >= 10 && cleaned.length <= 15;
};

// Email validation using RFC-compliant regex
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
};

// Name validation - allows letters, spaces, hyphens, and apostrophes
export const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  return name.length >= 2 && nameRegex.test(name);
};

// Zip code validation - US format
export const validateZipCode = (zip: string): boolean => {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zip);
};

// Address validation - basic check
export const validateAddress = (address: string): boolean => {
  // Check minimum length and basic structure
  return address.trim().length >= 10 && /\d/.test(address) && /[a-zA-Z]/.test(address);
};

// Price validation - accepts various formats
export const validatePrice = (price: string): boolean => {
  // Remove common formatting characters
  const cleaned = price.replace(/[$,\s]/g, '');
  
  // Check if it's a valid number
  const numPrice = parseFloat(cleaned);
  return !isNaN(numPrice) && numPrice > 0;
};

// Form field sanitization
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

// Check if field is empty after trimming
export const isFieldEmpty = (value: string | undefined | null): boolean => {
  return !value || value.trim().length === 0;
};

// Validate field length
export const validateLength = (value: string, min: number, max: number): boolean => {
  const length = value.trim().length;
  return length >= min && length <= max;
};