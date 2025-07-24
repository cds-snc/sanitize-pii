import { PiiPattern } from './types';

export const defaultPatterns: PiiPattern[] = [
  {
    name: 'address',
    regex:
      /\b[\d#-]+[\s-]+[A-Z\s-]+(?:street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|lane|ln|court|ct|place|pl|way|crescent|cres|circle|cir|parkway|pkwy|terrace|ter|square|sq|trail|trl|close|cl|grove|grv|heights|hts|hill|park|gardens|gdns|manor|mnr|estates|est|valley|vly|view|vw|point|pt|ridge|rdg|bay|cove|cv|mews|row|common|green|grn|landing|lndg|crossing|xing|glen|gln|meadow|mdw|pass|run|bend|curve|curv|fork|frk|gap|hollow|holw|knoll|knl|lock|lck|mill|ml|orchard|orch|path|pth|pine|pne|pond|shoal|shl|shore|shr|spring|spg|summit|smt|trace|trce|track|trak|turnpike|tpke|walk|wlk|woods|wds|private|prv)\.?\b/gi,
    description: 'Address',
  },
  {
    name: 'email',
    regex: /\b[^@\s]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
    description: 'Email address',
  },
  {
    name: 'canadian_passport',
    regex: /\b([A-Z]{2}[\s-]?\d{6})\b/g,
    description: 'Canadian passport',
  },
  {
    name: 'phone_number',
    regex:
      /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/g,
    description: 'North American phone number',
  },
  {
    name: 'postal_code',
    regex: /\b[A-Z]\d[A-Z][\s-]?\d[A-Z]\d\b/gi,
    description: 'Postal code',
  },
  {
    name: 'pri',
    regex: /\b\d{2,3}-?\d{3}-?\d{3}\b/g,
    description: 'Personal Record Identifier',
  },
  {
    name: 'sin',
    regex: /\b\d{3}-?\d{3}-?\d{3}\b/g,
    description: 'Social Insurance Number',
  },
];
