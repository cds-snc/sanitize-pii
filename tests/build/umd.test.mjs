import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

const umdPath = path.resolve(process.cwd(), 'dist/umd/sanitize-pii.min.js');
const umdCode = fs.readFileSync(umdPath, 'utf8');

const dom = new JSDOM(
  `
  <!DOCTYPE html>
  <html>
  <head></head>
  <body>
    <script>${umdCode}</script>
  </body>
  </html>
`,
  {
    runScripts: 'dangerously',
  }
);

const { window } = dom;

if (typeof window.sanitizePii !== 'function') {
  console.error('❌ UMD test failed: sanitizePii not available on window');
  process.exit(1);
}

const testText = 'Contact: 123-456-7890, Address: 123 Fake St';
const result = window.sanitizePii(testText);
if (result.includes('123-456-7890') || result.includes('123 Fake St')) {
  console.error('❌ UMD test failed: PII still visible in browser output');
  process.exit(1);
}
