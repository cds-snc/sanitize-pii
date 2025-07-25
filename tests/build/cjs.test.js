const { sanitizePii, PiiSanitizer } = require('../../dist/cjs/index.js');

const testText =
  'My email is jane.smith@company.org and phone is (555) 987-6543';
const result = sanitizePii(testText);

if (
  result.includes('jane.smith@company.org') ||
  result.includes('(555) 987-6543')
) {
  console.error('❌ CommonJS test failed: PII still visible in output');
  process.exit(1);
}

const sanitizer = new PiiSanitizer({
  replacementTemplate: '[HIDDEN: {name}]',
});
const customResult = sanitizer.sanitize('PRI: 987-651-421');

if (!customResult.includes('[HIDDEN: pri')) {
  console.error('❌ CommonJS test failed: Custom options not working');
  process.exit(1);
}

sanitizer.addPattern({
  name: 'custom-test',
  regex: /TEST-\d{3}/g,
  description: 'Test pattern',
});

const customPatternResult = sanitizer.sanitize('Code: TEST-123');
if (!customPatternResult.includes('[HIDDEN: custom-test]')) {
  console.error('❌ CommonJS test failed: Custom pattern addition failed');
  process.exit(1);
}

const initialCount = sanitizer.getPatterns().length;
sanitizer.removePattern('custom-test');
const afterRemovalCount = sanitizer.getPatterns().length;

if (afterRemovalCount !== initialCount - 1) {
  console.error('❌ CommonJS test failed: Pattern removal failed');
  process.exit(1);
}
