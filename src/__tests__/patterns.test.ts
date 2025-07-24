import { defaultPatterns } from '../patterns';

describe('Default Patterns', () => {
  describe('email pattern', () => {
    const emailPattern = defaultPatterns.find(p => p.name === 'email')!;

    it('should match valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'first+last@subdomain.example.org',
        'user123@test-domain.com',
      ];

      validEmails.forEach(email => {
        expect(emailPattern.regex.test(email)).toBe(true);
        emailPattern.regex.lastIndex = 0; // Reset for global regex
      });
    });

    it('should not match invalid email addresses', () => {
      const invalidEmails = [
        'notanemail',
        '@domain.com',
        'user@',
        'user@domain',
      ];

      invalidEmails.forEach(email => {
        expect(emailPattern.regex.test(email)).toBe(false);
        emailPattern.regex.lastIndex = 0;
      });
    });
  });

  describe('phone_number pattern', () => {
    const phonePattern = defaultPatterns.find(p => p.name === 'phone_number')!;

    it('should match valid North American phone numbers', () => {
      const validPhones = [
        '(555) 123-4567',
        '555-123-4567',
        '555.123.4567',
        '5551234567',
        '+1-555-123-4567',
        '+1 555 123 4567',
        '1-555-123-4567',
      ];

      validPhones.forEach(phone => {
        expect(phonePattern.regex.test(phone)).toBe(true);
        phonePattern.regex.lastIndex = 0;
      });
    });

    it('should not match invalid phone numbers', () => {
      const invalidPhones = ['123-456-789', '555-123-45678', 'abc-def-ghij'];

      invalidPhones.forEach(phone => {
        expect(phonePattern.regex.test(phone)).toBe(false);
        phonePattern.regex.lastIndex = 0;
      });
    });
  });

  describe('postal_code pattern', () => {
    const postalPattern = defaultPatterns.find(p => p.name === 'postal_code')!;

    it('should match valid Canadian postal codes', () => {
      const validPostalCodes = [
        'K1A 0A6',
        'M5V 3A8',
        'K1A-0A6',
        'M5V3A8',
        'k1a 0a6',
        'H3Z2Y7',
      ];

      validPostalCodes.forEach(code => {
        expect(postalPattern.regex.test(code)).toBe(true);
        postalPattern.regex.lastIndex = 0;
      });
    });

    it('should not match invalid postal codes', () => {
      const invalidPostalCodes = ['12345', 'K1A 0A', '1A1 A1A', 'AAA AAA'];

      invalidPostalCodes.forEach(code => {
        expect(postalPattern.regex.test(code)).toBe(false);
        postalPattern.regex.lastIndex = 0;
      });
    });
  });

  describe('pri pattern', () => {
    const priPattern = defaultPatterns.find(p => p.name === 'pri')!;

    it('should match valid Personal Record Identifiers', () => {
      const validPRIs = [
        '012-345-678',
        '12-345-678',
        '012345678',
        '12345678',
        '0123-456-789',
        '123-456-789',
      ];

      validPRIs.forEach(pri => {
        expect(priPattern.regex.test(pri)).toBe(true);
        priPattern.regex.lastIndex = 0;
      });
    });

    it('should not match invalid Personal Record Identifiers', () => {
      const invalidPRIs = [
        '1-345-678',
        '1234-345-678',
        '123-45-678',
        '123-3456-678',
        '123-345-67',
        '123-345-6789',
        'abc-def-ghi',
      ];

      invalidPRIs.forEach(pri => {
        expect(priPattern.regex.test(pri)).toBe(false);
        priPattern.regex.lastIndex = 0;
      });
    });
  });

  describe('sin pattern', () => {
    const sinPattern = defaultPatterns.find(p => p.name === 'sin')!;

    it('should match valid Social Insurance Numbers', () => {
      const validSINs = [
        '123-456-789',
        '123456789',
        '987-654-321',
        '111222333',
      ];

      validSINs.forEach(sin => {
        expect(sinPattern.regex.test(sin)).toBe(true);
        sinPattern.regex.lastIndex = 0;
      });
    });

    it('should not match invalid Social Insurance Numbers', () => {
      const invalidSINs = [
        '12-456-789',
        '1234-456-789',
        '123-45-789',
        '123-4567-789',
        '123-456-78',
        '123-456-7890',
        'abc-def-ghi',
        '123-456',
      ];

      invalidSINs.forEach(sin => {
        expect(sinPattern.regex.test(sin)).toBe(false);
        sinPattern.regex.lastIndex = 0;
      });
    });
  });

  describe('address pattern', () => {
    const addressPattern = defaultPatterns.find(p => p.name === 'address')!;

    it('should match valid addresses', () => {
      const validAddresses = [
        '123 Main St',
        '456 Elm Avenue.',
        '789 Maple Road',
        '101 Pine Boulevard',
        '202 Oak Drive',
        '#45-303 Cedar Prv.',
      ];

      validAddresses.forEach(address => {
        expect(addressPattern.regex.test(address)).toBe(true);
        addressPattern.regex.lastIndex = 0;
      });
    });

    it('should not match invalid addresses', () => {
      const invalidAddresses = [
        'Main St',
        '12345',
        'Elm Avenue 456',
        'Boulevard 789',
      ];

      invalidAddresses.forEach(address => {
        expect(addressPattern.regex.test(address)).toBe(false);
        addressPattern.regex.lastIndex = 0;
      });
    });
  });
  describe('passport pattern', () => {
    const passportPattern = defaultPatterns.find(
      p => p.name === 'canadian_passport'
    )!;

    it('should match valid Canadian passport numbers', () => {
      const validPassports = ['AB123456', 'CD 123456', 'EF-123456', 'GH123456'];

      validPassports.forEach(passport => {
        expect(passportPattern.regex.test(passport)).toBe(true);
        passportPattern.regex.lastIndex = 0;
      });
    });

    it('should not match invalid passport numbers', () => {
      const invalidPassports = [
        'A123456',
        'AB12345',
        'AB1234567',
        'AB-1234-56',
        '12345678',
      ];

      invalidPassports.forEach(passport => {
        expect(passportPattern.regex.test(passport)).toBe(false);
        passportPattern.regex.lastIndex = 0;
      });
    });
  });

  it('should have all required properties', () => {
    defaultPatterns.forEach(pattern => {
      expect(pattern.name).toBeDefined();
      expect(typeof pattern.name).toBe('string');
      expect(pattern.regex).toBeInstanceOf(RegExp);
      expect(pattern.regex.global).toBe(true); // Should be global for replacement
    });
  });

  it('should have unique pattern names', () => {
    const names = defaultPatterns.map(p => p.name);
    const uniqueNames = new Set(names);
    expect(names.length).toBe(uniqueNames.size);
  });
});
