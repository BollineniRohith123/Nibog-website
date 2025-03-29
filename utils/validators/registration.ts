// Validation utility for registration form
export interface RegistrationValidationErrors {
  childName?: string;
  childAge?: string;
  parentName?: string;
  contactInfo?: string;
  gameId?: string;
}

export function validateRegistration(data: {
  childName: string;
  childAge: number;
  parentName: string;
  contactInfo: string;
  gameId: number;
  minAge: number;
  maxAge: number;
}): RegistrationValidationErrors {
  const errors: RegistrationValidationErrors = {};

  // Child Name validation
  if (!data.childName || data.childName.trim().length < 2) {
    errors.childName = 'Child name must be at least 2 characters long';
  }

  // Child Age validation
  if (!data.childAge || data.childAge < 0 || data.childAge > 10) {
    errors.childAge = 'Child age must be between 0 and 10';
  }

  // Game Age Range validation
  if (data.childAge < data.minAge || data.childAge > data.maxAge) {
    errors.childAge = `Age must be between ${data.minAge} and ${data.maxAge} for this game`;
  }

  // Parent Name validation
  if (!data.parentName || data.parentName.trim().length < 2) {
    errors.parentName = 'Parent name must be at least 2 characters long';
  }

  // Contact Info (Email) validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.contactInfo || !emailRegex.test(data.contactInfo)) {
    errors.contactInfo = 'Please enter a valid email address';
  }

  // Game ID validation
  if (!data.gameId || data.gameId <= 0) {
    errors.gameId = 'Please select a valid game';
  }

  return errors;
}

// Helper function to check if form is valid
export function isRegistrationValid(errors: RegistrationValidationErrors): boolean {
  return Object.keys(errors).length === 0;
}
