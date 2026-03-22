// Email Validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone Validation (basic - at least 10 digits)
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  const digitsOnly = phone.replace(/\D/g, "");
  return digitsOnly.length >= 10;
};

// Password Validation (min 8 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special char)
export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) errors.push("Password must be at least 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("Password must contain uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("Password must contain lowercase letter");
  if (!/[0-9]/.test(password)) errors.push("Password must contain number");
  if (!/[!@#$%^&*]/.test(password)) errors.push("Password must contain special character (!@#$%^&*)");

  return { valid: errors.length === 0, errors };
};

// Date Validation
export const validateDate = (date: Date | string): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
};

// Future Date Validation
export const validateFutureDate = (date: Date | string): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return validateDate(dateObj) && dateObj > new Date();
};

// Date Range Validation
export const validateDateRange = (
  startDate: Date | string,
  endDate: Date | string
): boolean => {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;

  return validateDate(start) && validateDate(end) && end >= start;
};

// Currency Validation
export const validateCurrency = (amount: number | string): boolean => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return !isNaN(num) && num > 0;
};

// Badge ID Validation (alphanumeric, typically 1-20 chars)
export const validateBadgeId = (badgeId: string): boolean => {
  return /^[a-zA-Z0-9]{1,20}$/.test(badgeId);
};

// URL Validation
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Required Field Validator
export const validateRequired = (value: any): boolean => {
  if (value === null || value === undefined || value === "") return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
};

// Min Length Validator
export const validateMinLength = (value: string, min: number): boolean => {
  return Boolean(value && value.length >= min);
};

// Max Length Validator
export const validateMaxLength = (value: string, max: number): boolean => {
  return !value || value.length <= max;
};

// Unique Array Validator
export const validateUniqueArray = (array: any[]): boolean => {
  return array.length === new Set(array).size;
};

// Credit Card Validation (Luhn algorithm)
export const validateCreditCard = (cardNumber: string): boolean => {
  const digitsOnly = cardNumber.replace(/\D/g, "");

  if (digitsOnly.length < 13 || digitsOnly.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digitsOnly.length - 1; i >= 0; i--) {
    let digit = parseInt(digitsOnly[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

// Composite Validator Object
export const validators = {
  required: (value: any) =>
    validateRequired(value) ? undefined : "This field is required",

  email: (value: string) =>
    validateEmail(value) ? undefined : "Invalid email address",

  phone: (value: string) =>
    validatePhone(value) ? undefined : "Invalid phone number (minimum 10 digits)",

  password: (value: string) => {
    const { valid, errors } = validatePassword(value);
    return valid ? undefined : errors.join(". ");
  },

  minLength: (min: number) => (value: string) =>
    validateMinLength(value, min) ? undefined : `Minimum ${min} characters required`,

  maxLength: (max: number) => (value: string) =>
    validateMaxLength(value, max) ? undefined : `Maximum ${max} characters allowed`,

  url: (value: string) => (validateUrl(value) ? undefined : "Invalid URL"),

  badgeId: (value: string) => (validateBadgeId(value) ? undefined : "Badge ID must be alphanumeric (1-20 chars)"),

  dateRange: (start: Date | string, end: Date | string) =>
    validateDateRange(start, end) ? undefined : "End date must be after start date",

  futureDate: (value: Date | string) =>
    validateFutureDate(value) ? undefined : "Date must be in the future",

  currency: (value: number | string) =>
    validateCurrency(value) ? undefined : "Invalid amount",

  creditCard: (value: string) => (validateCreditCard(value) ? undefined : "Invalid card number"),
};
