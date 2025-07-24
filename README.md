# Sanitize PII

TypeScript module for removing personally identifiable information (PII) from text. 

## Installation

```bash
npm install sanitize-pii
```

## Quick Start

```typescript
import { sanitizePii, PiiSanitizer } from 'sanitize-pii';

// Simple usage with default patterns
const text = "Contact me at john@example.com or call (555) 123-4567 with Account ID 1234";
const sanitized = sanitizePii(text);
console.log(sanitized);
// Output: "Contact me at [Redacted: email] or call [Redacted: phone_number] with Account ID 1234"

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
// Output: "Contact me at ***email*** or call ***phone_number*** with ***account_id***"
```