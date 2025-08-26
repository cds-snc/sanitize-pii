import { validateLuhn, validateSin } from '../utils';

describe('validateLuhn', () => {
  it('should validate correct Luhn numbers', () => {
    const validNumbers = [
      '49927398716', // 11-digit valid Luhn
      '130692916', // 9-digit valid Luhn
      '123456782', // 9-digit valid Luhn
      '987654324', // 9-digit valid Luhn
    ];

    validNumbers.forEach(number => {
      expect(validateLuhn(number)).toBe(true);
    });
  });

  it('should reject invalid Luhn numbers', () => {
    const invalidNumbers = [
      '123456789', // Invalid Luhn
      '987654321', // Invalid Luhn
      '111222333', // Invalid Luhn
      '49927398717', // Invalid Luhn (wrong check digit)
    ];

    invalidNumbers.forEach(number => {
      expect(validateLuhn(number)).toBe(false);
    });
  });

  it('should handle numbers with separators', () => {
    expect(validateLuhn('130-692-916')).toBe(true);
    expect(validateLuhn('130 692 916')).toBe(true);
    expect(validateLuhn('130.692.916')).toBe(true);
    expect(validateLuhn('130_692_916')).toBe(true);
  });

  it('should reject numbers that are too short', () => {
    expect(validateLuhn('1')).toBe(false);
    expect(validateLuhn('')).toBe(false);
  });
});

describe('validateSin', () => {
  it('should validate correct Canadian SINs', () => {
    const validSins = [
      '130692916', // Valid SIN
      '123456782', // Valid SIN
      '987654324', // Valid SIN
      '555123454', // Valid SIN
      '111222337', // Valid SIN
    ];

    validSins.forEach(sin => {
      expect(validateSin(sin)).toBe(true);
    });
  });

  it('should validate SINs with various separators', () => {
    const validSins = [
      '130-692-916',
      '130 692 916',
      '130.692.916',
      '130_692_916',
      '123-456-782',
      '987 654 324',
    ];

    validSins.forEach(sin => {
      expect(validateSin(sin)).toBe(true);
    });
  });

  it('should reject invalid SINs', () => {
    const invalidSins = [
      '123456789', // Invalid Luhn
      '987654321', // Invalid Luhn
      '111222333', // Invalid Luhn
      '046454286', // Starts with 0 (reserved)
      '812345678', // Starts with 8 (reserved)
      '12345678', // Too short
      '1234567890', // Too long
      'abc123456', // Contains letters
      '', // Empty
    ];

    invalidSins.forEach(sin => {
      expect(validateSin(sin)).toBe(false);
    });
  });

  it('should reject SINs starting with 0 or 8', () => {
    // Generate valid Luhn numbers that start with 0 or 8
    expect(validateSin('012345674')).toBe(false); // Starts with 0
    expect(validateSin('812345673')).toBe(false); // Starts with 8
  });
});
