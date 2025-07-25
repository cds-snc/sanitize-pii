import { spawn } from 'child_process';
import path from 'path';

const tests = [
  { name: 'ESM', file: 'esm.test.mjs', command: 'node' },
  { name: 'CommonJS', file: 'cjs.test.cjs', command: 'node' },
  { name: 'UMD', file: 'umd.test.mjs', command: 'node' },
];

async function runTest(test) {
  return new Promise((resolve, reject) => {
    console.log(`\nRunning ${test.name} test...`);

    const testPath = path.resolve(process.cwd(), 'tests/build', test.file);
    const child = spawn(test.command, [testPath], {
      stdio: 'inherit',
    });

    child.on('close', code => {
      if (code === 0) {
        console.log(`✅ ${test.name} test passed`);
        resolve();
      } else {
        console.error(`❌ ${test.name} test failed with code ${code}`);
        reject(new Error(`${test.name} test failed`));
      }
    });

    child.on('error', error => {
      console.error(`❌ Failed to start ${test.name} test:`, error.message);
      reject(error);
    });
  });
}

async function runAllTests() {
  try {
    for (const test of tests) {
      await runTest(test);
    }
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
}

runAllTests();
