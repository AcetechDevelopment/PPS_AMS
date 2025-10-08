export const vehicleNum = (value) => {
  const formatted = value.toUpperCase();
  const regex = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;

    return {
      isValid: regex.test(formatted),
      value: formatted,
      error: regex.test(formatted) ? '' : 'Invalid vehicle number format',
  }
};


export const validateHSN = (value) => {
  const trimmed = String(value).trim();
  const regex = /^[1-9][0-9]{3}([0-9]{2})?([0-9]{2})?$/; // 4, 6, or 8 digits not starting with 0
  return {
    isValid: regex.test(trimmed),
    value: trimmed,
    error: regex.test(trimmed) ? '' : 'Invalid HSN code. Must be 4, 6, or 8 digits and not start with 0.',
  };
};

export const ValidMonth = (value) => {
  const trimmed = String(value).trim();
  const regex = /^(0?[1-9]|[1-9][0-9])$/; // matches 1 to 12, with optional leading 0

  return {
    isValid: regex.test(trimmed),
    value: trimmed,
    error: regex.test(trimmed) ? '' : 'Invalid month. Enter a value between 1 and 12.',
  };
};

export const ValidSingleDigit = (value) => {
  const trimmed = String(value).trim();
  const regex = /^(0?[1-9]|1[0-2])$/; // Matches 1–12, optionally 01–09

  return {
    isValid: regex.test(trimmed),
    value: trimmed,
    error: regex.test(trimmed) ? '' : 'Invalid month. Enter a value between 1 and 12.',
  };
};

export const ValiddoubleleDigit = (value) => {
  const trimmed = String(value).trim();
  const regex = /^(?:[1-9]|[1-4][0-9]|50)$/; 

  return {
    isValid: regex.test(trimmed),
    value: trimmed,
    error: regex.test(trimmed) ? '' : 'Invalid month. Enter a value between 1 and 50.',
  };
};