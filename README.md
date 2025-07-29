# Sanitize PII

TypeScript module for removing personally identifiable information (PII) from text.  The PII this module removes by default can be seen in [`src/patterns.ts`](./src/patterns.ts).

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

You can also use the module directly in a browser with the following CDN:
```html
<script src="https://cdn.jsdelivr.net/npm/@cdssnc/sanitize-pii@1.1.1/dist/umd/sanitize-pii.min.js"></script>
<script>
  const textareas = document.querySelectorAll('textarea');
  textareas.forEach(textarea => {
    textarea.value = sanitizePii(textarea.value);
  });
</script>
```

## Development

A [devcontainer](https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/introduction-to-dev-containers) has been provided to create a local or Codespaces dev environment.  If you submit a pull request, you can run the following to make sure everything works as expected:

```sh
npm ci
npm test
npm run lint
npm run format
npm run build
npm run test:build
```
