export interface PiiPattern {
  name: string;
  regex: RegExp;
  description?: string;
}

export interface SanitizeOptions {
  patterns?: PiiPattern[];
  useDefaultPatterns?: boolean;
  replacementTemplate?: string;
}
