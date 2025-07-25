import {
  sanitizePii,
  PiiSanitizer,
  defaultPatterns,
} from '../../dist/esm/index.js';

const testText = 'My address is 123 Fake St and SIN is 123-345-678';
const result = sanitizePii(testText);
if (result.includes('123 Fake St') || result.includes('123-345-678')) {
  console.error('❌ ESM test failed: PII still visible in output');
  process.exit(1);
}

const sanitizer = new PiiSanitizer();
const classResult = sanitizer.sanitize('Call me at 555-123-4567');

if (!classResult.includes('[Redacted:')) {
  console.error('❌ ESM test failed: Class instantiation failed');
  process.exit(1);
}

const detected = sanitizer.detectPii('My address is 123 Fake St');
if (detected.length === 0) {
  console.error('❌ ESM test failed: Pattern detection failed');
  process.exit(1);
}

if (!Array.isArray(defaultPatterns) || defaultPatterns.length === 0) {
  console.error('❌ ESM test failed: Default patterns not exported properly');
  process.exit(1);
}
