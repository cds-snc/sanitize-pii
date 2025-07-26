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
      const result = customSanitizer.sanitize('123456789');
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
      expect(result).toContain('address_en');
    });

    it('should detect multiple PII types', () => {
      const result = sanitizer.detectPii('PRI 12345678 or call (555) 123-4567');
      expect(result).toContain('pri');
      expect(result).toContain('phone_number');
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
});
