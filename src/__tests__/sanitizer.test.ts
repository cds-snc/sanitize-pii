import { PiiSanitizer, sanitizePii } from '../sanitizer';
import { defaultPatterns } from '../patterns';

describe('PiiSanitizer', () => {
  let sanitizer: PiiSanitizer;

  beforeEach(() => {
    sanitizer = new PiiSanitizer();
  });

  describe('constructor', () => {
    it('should create instance with default patterns', () => {
      const patterns = sanitizer.getPatterns();
      expect(patterns).toHaveLength(defaultPatterns.length);
    });

    it('should create instance with custom patterns only', () => {
      const customPattern = {
        name: 'test',
        regex: /test/g,
      };
      const customSanitizer = new PiiSanitizer({
        patterns: [customPattern],
        useDefaultPatterns: false,
      });
      const patterns = customSanitizer.getPatterns();
      expect(patterns).toHaveLength(1);
      expect(patterns[0].name).toBe('test');
    });

    it('should create instance with custom replacement template', () => {
      const customSanitizer = new PiiSanitizer({
        replacementTemplate: '***{name}***',
      });
      const result = customSanitizer.sanitize('130692916');
      expect(result).toBe('***sin***');
    });
  });

  describe('addPattern', () => {
    it('should add new pattern', () => {
      const initialCount = sanitizer.getPatterns().length;
      sanitizer.addPattern({
        name: 'custom',
        regex: /custom/g,
      });
      expect(sanitizer.getPatterns()).toHaveLength(initialCount + 1);
    });
  });

  describe('removePattern', () => {
    it('should remove pattern by name', () => {
      const initialCount = sanitizer.getPatterns().length;
      sanitizer.removePattern('phone_number');
      expect(sanitizer.getPatterns()).toHaveLength(initialCount - 1);
      expect(
        sanitizer.getPatterns().find(p => p.name === 'phone_number')
      ).toBeUndefined();
    });
  });

  describe('setReplacementTemplate', () => {
    it('should update replacement template', () => {
      sanitizer.setReplacementTemplate('REMOVED_{name}');
      const result = sanitizer.sanitize('123 Fake St');
      expect(result).toBe('REMOVED_address_en');
    });
  });

  describe('sanitize', () => {
    it('should handle null/undefined input', () => {
      expect(sanitizer.sanitize(null as any)).toBe(null);
      expect(sanitizer.sanitize(undefined as any)).toBe(undefined);
      expect(sanitizer.sanitize('')).toBe('');
    });

    it('should handle non-string input', () => {
      expect(sanitizer.sanitize(123 as any)).toBe(123);
    });

    it('should sanitize home addresses', () => {
      const text = 'Contact me at 123 Fake St or 34 rue Bernard for more info';
      const result = sanitizer.sanitize(text);
      expect(result).toBe(
        'Contact me at [Redacted: address_en] or [Redacted: address_fr] for more info'
      );
    });

    it('should sanitize multiple phone numbers', () => {
      const text = 'Call (555) 123-4567 or (555) 987-6543';
      const result = sanitizer.sanitize(text);
      expect(result).toBe(
        'Call [Redacted: phone_number] or [Redacted: phone_number]'
      );
    });

    it('should sanitize phone numbers', () => {
      const testCases = [
        'Call me at (555) 123-4567',
        'My number is 555-123-4567',
        'Phone: 555.123.4567',
        'Contact: 5551234567',
        'International: +1-555-123-4567',
      ];

      testCases.forEach(text => {
        const result = sanitizer.sanitize(text);
        expect(result).toContain('[Redacted: phone_number]');
        expect(result).not.toMatch(/\d{3}.*\d{3}.*\d{4}/);
      });
    });

    it('should sanitize Canadian postal codes', () => {
      const testCases = [
        'My address is K1A 0A6',
        'Postal code: M5V3A8',
        'Location: K1A-0A6',
      ];

      testCases.forEach(text => {
        const result = sanitizer.sanitize(text);
        expect(result).toContain('[Redacted: postal_code]');
      });
    });

    it('should sanitize multiple PII types in one text', () => {
      const text =
        'Call me at (555) 123-4567. My postal code is K1A 0A6 and I live at 123 Main St., Ottawa.';
      const result = sanitizer.sanitize(text);
      expect(result).toBe(
        'Call me at [Redacted: phone_number]. My postal code is [Redacted: postal_code] and I live at [Redacted: address_en]., Ottawa.'
      );
    });

    it('should sanitize mix of all PII patterns', () => {
      const text =
        'Contact John at (613) 555-1234, lives at 45 Maple Ave, postal code K1A 0A6. ' +
        'SIN: 130-692-916, PRI: 12-345-678. ' +
        'Ontario drivers license: A1234-56789-01234, Quebec license: B5678-123456-78. ' +
        'Alberta license: 123456-789, Manitoba license: AB-CD-EF-G123HI. ' +
        'Newfoundland license: C987654321, Nova Scotia license: ABC-123456789. ' +
        'Health cards - Ontario: 1234-567-890-AB, Quebec: ABCD-1234-5678. ' +
        'Alberta health: 12345-6789, Newfoundland health: 123-456-789-012. ' +
        'Nova Scotia health: 1234-567-890, NWT health: A1234567. ' +
        'Passport: AB123456, Credit card: 1234-5678-9012-3456. ' +
        'IP: 192.168.1.1, API key: gcntfy-test-12345678-1234-1234-1234-123456789012. ' +
        'PO Box: P.O. BOX 123, 7-digit number: 1234567. ' +
        'Address (en): 123 Fake Ave, Address (fr): 34 rue Bernard. ' +
        'Bank account: 12345-678-123456789012';

      const result = sanitizer.sanitize(text);

      expect(result).toBe(
        'Contact John at [Redacted: phone_number], lives at [Redacted: address_en], postal code [Redacted: postal_code]. SIN: [Redacted: sin], PRI: [Redacted: pri]. Ontario drivers license: [Redacted: drivers_license_ontario], Quebec license: [Redacted: drivers_license_quebec]. Alberta license: [Redacted: drivers_license_alberta], Manitoba license: [Redacted: drivers_license_manitoba]. Newfoundland license: [Redacted: drivers_license_newfoundland], Nova Scotia license: [Redacted: drivers_license_nova_scotia]. Health cards - Ontario: [Redacted: health_card_nova_scotia]-AB, Quebec: [Redacted: health_card_quebec]. Alberta health: [Redacted: health_card_alberta], Newfoundland health: [Redacted: health_card_newfoundland]. Nova Scotia health: [Redacted: health_card_nova_scotia], NWT health: [Redacted: health_card_nwt]. Passport: [Redacted: passport_canada], Credit card: [Redacted: credit_card]. IP: [Redacted: ip_address], API key: [Redacted: api_key_gc_notify]. PO Box: [Redacted: po_box], 7-digit number: [Redacted: 7+_digit_number]. Address (en): [Redacted: address_en], Address (fr): [Redacted: address_fr]. Bank account: [Redacted: bank_account_canada]'
      );
    });

    it('should preserve non-PII text', () => {
      const text = 'This is just regular text with no PII';
      const result = sanitizer.sanitize(text);
      expect(result).toBe(text);
    });
  });

  describe('detectPii', () => {
    it('should return empty array for text without PII', () => {
      const result = sanitizer.detectPii('Just regular text');
      expect(result).toEqual([]);
    });

    it('should detect home addresses', () => {
      const result = sanitizer.detectPii('Contact me at 123 Fake Ave');
      expect(result).toHaveLength(1);
      expect(result[0].pattern).toBe('address_en');
      expect(result[0].match).toBe('123 Fake Ave');
    });

    it('should detect multiple PII types', () => {
      const result = sanitizer.detectPii(
        'PRI 12345678 or call (555) 123-4567 and my address is 123 Fake St'
      );
      expect(result).toHaveLength(3);

      expect(result).toEqual([
        { pattern: 'address_en', match: '123 Fake St' },
        { pattern: 'phone_number', match: '(555) 123-4567' },
        { pattern: 'pri', match: '12345678' },
      ]);
    });

    it('should handle null/undefined input', () => {
      expect(sanitizer.detectPii(null as any)).toEqual([]);
      expect(sanitizer.detectPii(undefined as any)).toEqual([]);
    });
  });
});

describe('sanitizePii convenience function', () => {
  it('should sanitize using default sanitizer', () => {
    const result = sanitizePii('Call me at 1-123-456-7890');
    expect(result).toBe('Call me at [Redacted: phone_number]');
  });

  it('should sanitize using custom options', () => {
    const result = sanitizePii('Call me at 1-123-456-7890', {
      replacementTemplate: '***{name}***',
    });
    expect(result).toBe('Call me at ***phone_number***');
  });

  it('should work with custom patterns only', () => {
    const result = sanitizePii('test@example.com and secret123', {
      useDefaultPatterns: false,
      patterns: [
        {
          name: 'secret',
          regex: /secret\d+/g,
        },
      ],
    });
    expect(result).toBe('test@example.com and [Redacted: secret]');
  });

  it('should detect PII without sanitizing', () => {
    const result = sanitizePii(
      'Phone: 1-123-456-7890 Address: 4352 rue Portage SIN: 130692916',
      { detectOnly: true }
    );
    const parsed = JSON.parse(result);
    expect(parsed).toEqual([
      { pattern: 'address_fr', match: '4352 rue Portage' },
      { pattern: 'phone_number', match: '1-123-456-7890' },
      { pattern: 'sin', match: '130692916' },
    ]);
  });
});
