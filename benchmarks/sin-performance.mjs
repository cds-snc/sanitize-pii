/**
 * Performance benchmark comparing regex-only SIN detection vs Luhn validation
 */

// Import both old and new implementations
const oldSinPattern = { 
  name: 'sin',
  regex: /\b(:?\d{3}[-_.\s]?){3}\b/g,
  description: 'Social Insurance Number (regex only)',
};

import { defaultPatterns } from '../dist/esm/patterns.js';
import { PiiSanitizer } from '../dist/esm/sanitizer.js';

const newSinPattern = defaultPatterns.find(p => p.name === 'sin');

// Test data: mix of valid SINs, invalid SINs, and non-SIN 9-digit numbers
const testData = [
  // Valid SINs (should be detected by new implementation only)
  '130-692-916',
  '123-456-782', 
  '987 654 324',
  '555.123.454',
  '111_222_337',
  
  // Invalid SINs (should be detected by old implementation but not new)
  '123-456-789',
  '987-654-321',
  '111-222-333',
  '555-123-456',
  '999-888-777',
  
  // Reserved SINs (start with 0 or 8 - should not be detected by new implementation)
  '012-345-674',
  '823-456-789',
  
  // Non-SIN numbers that happen to match the format
  '192-168-001', // IP-like
  '123-456-000', // Clearly fake
  
  // Text with embedded SINs
  'My SIN is 130-692-916 and I live at 123 Main St',
  'Please call me at 555-123-4567 or use SIN 123-456-782',
  'Invalid SIN 123-456-789 should not be detected by new algorithm',
  'Contact info: SIN 987 654 324, Phone (555) 123-4567',
  
  // Long text with multiple potential matches
  `Contact information: John Doe, SIN 130-692-916, Phone (555) 123-4567.
   Emergency contact: Jane Smith, SIN 123-456-782, Phone (555) 987-6543.
   Previous applicant: Bob Johnson, SIN 987 654 324, Phone (555) 111-2222.
   Invalid records: 123-456-789, 987-654-321, 111-222-333 should be ignored.
   Address: 123 Main Street, Toronto, ON K1A 0A6`,
];

function benchmarkOldImplementation(iterations = 10000) {
  const sanitizer = new PiiSanitizer({
    patterns: [oldSinPattern],
    useDefaultPatterns: false,
  });
  
  console.log(`\n=== OLD IMPLEMENTATION (Regex Only) ===`);
  
  const start = performance.now();
  let detectedCount = 0;
  
  for (let i = 0; i < iterations; i++) {
    for (const text of testData) {
      const detected = sanitizer.detectPii(text);
      detectedCount += detected.length;
    }
  }
  
  const end = performance.now();
  const totalTime = end - start;
  const avgTimePerIteration = totalTime / iterations;
  const avgTimePerText = totalTime / (iterations * testData.length);
  
  console.log(`Iterations: ${iterations}`);
  console.log(`Total test strings: ${testData.length}`);
  console.log(`Total detections: ${detectedCount}`);
  console.log(`Total time: ${totalTime.toFixed(2)}ms`);
  console.log(`Average time per iteration: ${avgTimePerIteration.toFixed(4)}ms`);
  console.log(`Average time per text: ${avgTimePerText.toFixed(6)}ms`);
  
  return { totalTime, detectedCount, avgTimePerIteration, avgTimePerText };
}

function benchmarkNewImplementation(iterations = 10000) {
  const sanitizer = new PiiSanitizer({
    patterns: [newSinPattern],
    useDefaultPatterns: false,
  });
  
  console.log(`\n=== NEW IMPLEMENTATION (Regex + Luhn Validation) ===`);
  
  const start = performance.now();
  let detectedCount = 0;
  
  for (let i = 0; i < iterations; i++) {
    for (const text of testData) {
      const detected = sanitizer.detectPii(text);
      detectedCount += detected.length;
    }
  }
  
  const end = performance.now();
  const totalTime = end - start;
  const avgTimePerIteration = totalTime / iterations;
  const avgTimePerText = totalTime / (iterations * testData.length);
  
  console.log(`Iterations: ${iterations}`);
  console.log(`Total test strings: ${testData.length}`);
  console.log(`Total detections: ${detectedCount}`);
  console.log(`Total time: ${totalTime.toFixed(2)}ms`);
  console.log(`Average time per iteration: ${avgTimePerIteration.toFixed(4)}ms`);
  console.log(`Average time per text: ${avgTimePerText.toFixed(6)}ms`);
  
  return { totalTime, detectedCount, avgTimePerIteration, avgTimePerText };
}

function compareAccuracy() {
  const oldSanitizer = new PiiSanitizer({
    patterns: [oldSinPattern],
    useDefaultPatterns: false,
  });
  
  const newSanitizer = new PiiSanitizer({
    patterns: [newSinPattern],
    useDefaultPatterns: false,
  });
  
  console.log(`\n=== ACCURACY COMPARISON ===`);
  
  const validSins = ['130-692-916', '123-456-782', '987 654 324', '555.123.454'];
  const invalidSins = ['123-456-789', '987-654-321', '111-222-333', '012-345-674'];
  
  console.log('\nValid SINs (should be detected):');
  for (const sin of validSins) {
    const oldDetected = oldSanitizer.detectPii(sin).length > 0;
    const newDetected = newSanitizer.detectPii(sin).length > 0;
    console.log(`  ${sin}: Old=${oldDetected}, New=${newDetected} ${newDetected ? '✓' : '✗'}`);
  }
  
  console.log('\nInvalid SINs (should NOT be detected by new implementation):');
  for (const sin of invalidSins) {
    const oldDetected = oldSanitizer.detectPii(sin).length > 0;
    const newDetected = newSanitizer.detectPii(sin).length > 0;
    console.log(`  ${sin}: Old=${oldDetected}, New=${newDetected} ${!newDetected ? '✓' : '✗'}`);
  }
}

// Run benchmarks
const iterations = 10000;

console.log('SIN Detection Performance Benchmark');
console.log('====================================');
console.log(`Running ${iterations} iterations with ${testData.length} test strings each...`);

const oldResults = benchmarkOldImplementation(iterations);
const newResults = benchmarkNewImplementation(iterations);

console.log(`\n=== PERFORMANCE SUMMARY ===`);
console.log(`Old implementation: ${oldResults.totalTime.toFixed(2)}ms total, ${oldResults.avgTimePerText.toFixed(6)}ms per text`);
console.log(`New implementation: ${oldResults.totalTime.toFixed(2)}ms total, ${newResults.avgTimePerText.toFixed(6)}ms per text`);

const slowdownFactor = newResults.totalTime / oldResults.totalTime;
const slowdownPercentage = ((slowdownFactor - 1) * 100);

if (slowdownFactor > 1) {
  console.log(`Performance impact: ${slowdownFactor.toFixed(2)}x slower (${slowdownPercentage.toFixed(1)}% increase)`);
} else {
  console.log(`Performance improvement: ${(1/slowdownFactor).toFixed(2)}x faster (${(-slowdownPercentage).toFixed(1)}% decrease)`);
}

console.log(`Accuracy trade-off: Old detected ${oldResults.detectedCount} items, New detected ${newResults.detectedCount} items`);
console.log(`False positive reduction: ${oldResults.detectedCount - newResults.detectedCount} fewer false positives`);

// Run accuracy comparison
compareAccuracy();

console.log(`\n=== RECOMMENDATION ===`);
if (slowdownFactor < 2.0) {
  console.log(`✓ The performance impact (${slowdownPercentage.toFixed(1)}%) is acceptable for the improved accuracy.`);
} else {
  console.log(`⚠ The performance impact (${slowdownPercentage.toFixed(1)}%) is significant and should be considered.`);
}

console.log(`✓ Luhn validation eliminates ${oldResults.detectedCount - newResults.detectedCount} false positives.`);
console.log(`✓ Provides more accurate PII detection aligned with Canadian SIN standards.`);