// Export types
export type { PiiPattern, SanitizeOptions } from './types';

// Export patterns
export { defaultPatterns } from './patterns';

// Export main functionality
export { PiiSanitizer, defaultSanitizer, sanitizePii } from './sanitizer';

// Default export for UMD builds
export { sanitizePii as default } from './sanitizer';
