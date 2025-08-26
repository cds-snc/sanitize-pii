/**
 * Validates a number against the Luhn algorithm
 * @param input The input string to validate (digits only, no separators)
 * @returns true if the number passes Luhn validation, false otherwise
 */
export function validateLuhn(input: string): boolean {
  // Remove all non-digit characters
  const digits = input.replace(/\D/g, '');

  // Must have at least 2 digits
  if (digits.length < 2) {
    return false;
  }

  // Convert to array of numbers
  const nums = digits.split('').map(Number);

  // Apply Luhn algorithm
  // Start from the second-to-last digit and work backwards
  let sum = 0;
  for (let i = nums.length - 2; i >= 0; i--) {
    let digit = nums[i];

    // Double every second digit from right to left
    if ((nums.length - 1 - i) % 2 === 1) {
      digit *= 2;

      // If result is two digits, subtract 9
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
  }

  // Add the check digit (last digit)
  sum += nums[nums.length - 1];

  // Valid if sum is divisible by 10
  return sum % 10 === 0;
}

/**
 * Validates a Social Insurance Number according to Canadian rules
 * @param sin The SIN to validate (with or without separators)
 * @returns true if valid, false otherwise
 */
export function validateSin(sin: string): boolean {
  // Remove all separators and convert to string of digits
  const digits = sin.replace(/[^0-9]/g, '');

  // Must be exactly 9 digits
  if (digits.length !== 9) {
    return false;
  }

  // Cannot start with 0 or 8 (reserved numbers)
  if (digits[0] === '0' || digits[0] === '8') {
    return false;
  }

  // Apply Luhn algorithm validation
  return validateLuhn(digits);
}
