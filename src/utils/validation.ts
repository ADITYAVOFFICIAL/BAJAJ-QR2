export const validateRequired = (value: unknown): boolean => {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === "string" && value.trim() === "") {
    return false;
  }
  if (Array.isArray(value) && value.length === 0) {
    return false;
  }
  return true;
};

export const validateMinLength = (
  value: string | undefined | null,
  minLength: number
): boolean => {
  if (!value) {
    return minLength === 0;
  }
  return value.length >= minLength;
};

export const validateMaxLength = (
  value: string | undefined | null,
  maxLength: number
): boolean => {
  if (value === null || value === undefined) {
    return true;
  }
  if (typeof value === "string") {
    return value.length <= maxLength;
  }
  return true;
};

export const validateEmail = (email: string | undefined | null): boolean => {
  if (!email) {
    return true;
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (
  phone: string | undefined | null
): boolean => {
  if (!phone) {
    return true;
  }
  const phoneRegex = /^[+]?[\d\s()-]{1,}$/;
  return phoneRegex.test(phone);
};

export const validateNumber = (value: unknown): boolean => {
  if (value === null || value === undefined || value === "") {
    return true; 
  }
  const num = Number(value);
  return !isNaN(num) && isFinite(num);
};

export const validateNumberRange = (
  value: number | undefined | null,
  min?: number,
  max?: number
): boolean => {
  if (value === null || value === undefined) {
    return true; 
  }
  if (typeof value !== "number" || isNaN(value)) {
    return false;
  }
  if (min !== undefined && value < min) {
    return false;
  }
  if (max !== undefined && value > max) {
    return false;
  }
  return true;
};

export const validateDateFormat = (
  dateString: string | undefined | null
): boolean => {
  if (!dateString) {
    return true; 
  }
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return false;
  }
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date.toISOString().startsWith(dateString);
};
