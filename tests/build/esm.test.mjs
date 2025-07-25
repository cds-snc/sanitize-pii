import {
  sanitizePii,
  PiiSanitizer,
  defaultPatterns,
} from '../../dist/esm/index.js';

const testText = 'My email is john.doe@example.com and SSN is 123-45-6789';
const result = sanitizePii(testText);

if (result.includes('john.doe@example.com') || result.includes('123-45-6789')) {
  console.error('❌ ESM test failed: PII still visible in output');
  process.exit(1);
}

const sanitizer = new PiiSanitizer();
const classResult = sanitizer.sanitize('Call me at 555-123-4567');

if (!classResult.includes('[Redacted:')) {
  console.error('❌ ESM test failed: Class instantiation failed');
  process.exit(1);
}

const detected = sanitizer.detectPii('My email is test@example.com');
if (detected.length === 0) {
  console.error('❌ ESM test failed: Pattern detection failed');
  process.exit(1);
}

if (!Array.isArray(defaultPatterns) || defaultPatterns.length === 0) {
  console.error('❌ ESM test failed: Default patterns not exported properly');
  process.exit(1);
}
