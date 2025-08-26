import { PiiSanitizer } from '../sanitizer';

describe('SIN Luhn validation integration', () => {
  let sanitizer: PiiSanitizer;

  beforeEach(() => {
    sanitizer = new PiiSanitizer();
  });

  it('should sanitize valid SINs', () => {
    const validSins = [
      'My SIN is 130-692-916',
      'Contact me with SIN: 123456782',
      'SIN 987 654 324 for reference',
      'Using SIN 555.123.454 in the system',
    ];

    validSins.forEach(text => {
      const result = sanitizer.sanitize(text);
      expect(result).toContain('[Redacted: sin]');
      expect(result).not.toMatch(/\d{3}[-\s.]\d{3}[-\s.]\d{3}/);
    });
  });

  it('should NOT sanitize invalid SINs as SIN pattern (false positive prevention)', () => {
    const invalidSins = [
      'My fake SIN is 123-456-789', // Invalid Luhn - may be detected as PRI
      'Random number: 987654321', // Invalid Luhn - may be detected as 7+_digit_number
      'Invalid: 111-222-333', // Invalid Luhn - may be detected as PRI
      'Reserved SIN 046-454-286', // Starts with 0 - may be detected as PRI
      'Test number 812-345-678', // Starts with 8 - may be detected as PRI
    ];

    invalidSins.forEach(text => {
      const result = sanitizer.sanitize(text);
      // Should NOT be detected as SIN specifically
      expect(result).not.toContain('[Redacted: sin]');

      // May be detected by other patterns, but that's fine
      const detected = sanitizer.detectPii(text);
      const sinDetections = detected.filter(d => d.pattern === 'sin');
      expect(sinDetections).toHaveLength(0);
    });
  });

  it('should detect valid SINs and validate with Luhn algorithm', () => {
    const validSin = 'My SIN is 130-692-916 for reference';
    const invalidSin = 'My fake SIN is 123-456-789 which is invalid';

    const validResult = sanitizer.detectPii(validSin);
    const invalidResult = sanitizer.detectPii(invalidSin);

    const validSinDetections = validResult.filter(d => d.pattern === 'sin');
    const invalidSinDetections = invalidResult.filter(d => d.pattern === 'sin');

    expect(validSinDetections).toHaveLength(1);
    expect(validSinDetections[0].match).toContain('130-692-916');
    expect(invalidSinDetections).toHaveLength(0); // Should not be detected as SIN
  });

  it('should handle various SIN formats with Luhn validation', () => {
    const formats = [
      '130-692-916', // Dashes
      '130 692 916', // Spaces
      '130.692.916', // Dots
      '130_692_916', // Underscores
      '130692916', // No separators
    ];

    formats.forEach(sin => {
      const result = sanitizer.sanitize(`SIN: ${sin}`);
      expect(result).toBe('SIN: [Redacted: sin]');
    });
  });

  it('should maintain performance within reasonable bounds', () => {
    const testText = 'SIN 130-692-916 and phone (555) 123-4567';
    const iterations = 1000;

    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      sanitizer.sanitize(testText);
    }
    const end = performance.now();

    const timePerIteration = (end - start) / iterations;
    // Should complete 1000 iterations in reasonable time (< 100ms total)
    expect(end - start).toBeLessThan(100);
    expect(timePerIteration).toBeLessThan(0.1); // Less than 0.1ms per operation
  });
});
