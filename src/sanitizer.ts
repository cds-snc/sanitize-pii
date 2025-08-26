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

      if (pattern.validator) {
        // Use custom validation for this pattern
        sanitizedText = sanitizedText.replace(pattern.regex, match => {
          return pattern.validator?.(match) ? replacement : match;
        });
      } else {
        // Use simple regex replacement
        sanitizedText = sanitizedText.replace(pattern.regex, replacement);
      }
    }

    return sanitizedText;
  }

  /**
   * Check if text contains any PII without sanitizing it
   * @param text The text to check
   * @returns Array of objects containing pattern names and matched strings
   */
  detectPii(text: string): { pattern: string; match: string }[] {
    if (!text || typeof text !== 'string') {
      return [];
    }

    const detectedPatterns: { pattern: string; match: string }[] = [];
    let remainingText = text;

    for (const pattern of this.patterns) {
      const regex = new RegExp(pattern.regex.source, pattern.regex.flags);

      if (pattern.validator) {
        // Use custom validation for this pattern - find all valid matches
        const matches = [...remainingText.matchAll(regex)];
        let foundValidMatch = false;

        for (const match of matches) {
          if (pattern.validator?.(match[0])) {
            detectedPatterns.push({
              pattern: pattern.name,
              match: match[0],
            });
            foundValidMatch = true;
            break; // Only take the first valid match to maintain original behavior
          }
        }

        if (foundValidMatch) {
          // Remove all regex matches from remaining text to prevent overlap
          remainingText = remainingText.replace(pattern.regex, '');
        }
      } else {
        // Use simple regex matching - original behavior
        const match = remainingText.match(regex);
        if (match) {
          detectedPatterns.push({
            pattern: pattern.name,
            match: match[0],
          });
          remainingText = remainingText.replace(pattern.regex, '');
        }
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
    return JSON.stringify(sanitizer.detectPii(text));
  } else {
    return sanitizer.sanitize(text);
  }
}
