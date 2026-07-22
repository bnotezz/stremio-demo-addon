const { execSync } = require('child_process');

try {
  console.log('Running generator...');
  execSync('npx tsx src/generate-stremio.ts', { stdio: 'inherit' });
} catch (err) {
  console.error('Failed to run generator:', err);
  process.exit(1);
}