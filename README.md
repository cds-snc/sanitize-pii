# Sanitize PII

TypeScript module for removing personally identifiable information (PII) from text. 

## Installation

```sh
npm install @cdssnc/sanitize-pii
```

## Quick start

```typescript
import { sanitizePii, PiiSanitizer } from '@cdssnc/sanitize-pii';

// Simple usage with default patterns
const text = "Contact me at (555) 123-4567 with Account ID 1234";
const sanitized = sanitizePii(text);
console.log(sanitized);
// Output: "Contact me at [Redacted: phone_number] with Account ID 1234"

// Sanitizer with custom replacement template and pattern
const sanitizer = new PiiSanitizer({
  replacementTemplate: '***{name}***',
  patterns: [
    {
      name: 'account_id',
      regex: /\bAccount\sID\s\d{4}\b/g,
    }
  ]
});

const result = sanitizer.sanitize(text);
console.log(result);
// Output: "Contact me at ***phone_number*** with ***account_id***"
```

## Development

Pull requests run the following, which can also be done locally to make sure everything works as expected:

```sh
npm ci
npm test
npm run lint
npm run format
npm run build
npm run test:build
```