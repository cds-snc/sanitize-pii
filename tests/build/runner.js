const { spawn } = require('child_process');
const path = require('path');

const tests = [
  //{ name: 'ESM', file: 'esm.test.mjs', command: 'node' },
  { name: 'CommonJS', file: 'cjs.test.js', command: 'node' },
  { name: 'UMD', file: 'umd.test.js', command: 'node' },
];

async function runTest(test) {
  return new Promise((resolve, reject) => {
    console.log(`\nRunning ${test.name} test...`);

    const testPath = path.join(__dirname, test.file);
    const child = spawn(test.command, [testPath], {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '../..'),
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
