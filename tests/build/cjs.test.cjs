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
  console.error('❌ Custom template test failed');
  process.exit(1);
}
