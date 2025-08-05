import { PiiPattern, SanitizeOptions } from './types.js';
import { defaultPatterns } from './patterns.js';

/**
 * PII Sanitizer for redacting personally identifiable information from text
 */
export class PiiSanitizer {
  private patterns: PiiPattern[];
  private replacementTemplate: string;

  /**
   * Create a new PiiSanitizer instance
   * @param options Configuration options
   */
  constructor(options: SanitizeOptions = {}) {
    const {
      patterns = [],
      useDefaultPatterns = true,
      replacementTemplate = '[Redacted: {name}]',
    } = options;

    this.patterns = useDefaultPatterns
      ? [...defaultPatterns, ...patterns]
      : patterns;
    this.replacementTemplate = replacementTemplate;
  }

  /**
   * Add a new PII pattern to the sanitizer
   * @param pattern The PII pattern to add
   */
  addPattern(pattern: PiiPattern): void {
    this.patterns.push(pattern);
  }

  /**
   * Remove a pattern by name
   * @param name The name of the pattern to remove
   */
  removePattern(name: string): void {
    this.patterns = this.patterns.filter(pattern => pattern.name !== name);
  }

  /**
   * Get all current patterns
   * @returns Array of current PII patterns
   */
  getPatterns(): PiiPattern[] {
    return [...this.patterns];
  }

  /**
   * Set the replacement template
   * @param template The template string (use {name} as placeholder)
   */
  setReplacementTemplate(template: string): void {
    this.replacementTemplate = template;
  }

  /**
   * Sanitize text by replacing PII with redaction messages
   * @param text The text to sanitize
   * @returns The sanitized text with PII redacted
   */
  sanitize(text: string): string {
    if (!text || typeof text !== 'string') {
      return text;
    }

    let sanitizedText = text;

    for (const pattern of this.patterns) {
      const replacement = this.replacementTemplate.replace(
        '{name}',
        pattern.name
      );
      sanitizedText = sanitizedText.replace(pattern.regex, replacement);
    }

    return sanitizedText;
  }

  /**
   * Check if text contains any PII without sanitizing it
   * @param text The text to check
   * @returns Array of pattern names that matched
   */
  detectPii(text: string): string[] {
    if (!text || typeof text !== 'string') {
      return [];
    }

    const detectedPatterns: string[] = [];
    let remainingText = text;

    for (const pattern of this.patterns) {
      const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
      if (regex.test(remainingText)) {
        detectedPatterns.push(pattern.name);
        remainingText = remainingText.replace(pattern.regex, '');
      }
    }

    return detectedPatterns;
  }
}

/**
 * Default instance for convenience
 */
export const defaultSanitizer = new PiiSanitizer();

/**
 * Convenience function to sanitize text using default patterns
 * @param text The text to sanitize
 * @param options Optional configuration
 * @returns The sanitized text
 */
export function sanitizePii(text: string, options?: SanitizeOptions): string {
  let sanitizer;
  if (options) {
    sanitizer = new PiiSanitizer(options);
  } else {
    sanitizer = defaultSanitizer;
  }

  if (options?.detectOnly) {
    return sanitizer.detectPii(text).join(',');
  } else {
    return sanitizer.sanitize(text);
  }
}
