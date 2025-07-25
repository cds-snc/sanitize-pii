// Export types
export type { PiiPattern, SanitizeOptions } from './types.js';

// Export patterns
export { defaultPatterns } from './patterns.js';

// Export main functionality
export { PiiSanitizer, defaultSanitizer, sanitizePii } from './sanitizer.js';

// Default export for UMD builds
export { sanitizePii as default } from './sanitizer.js';
