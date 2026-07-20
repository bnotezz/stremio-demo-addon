const esbuild = require('esbuild');

async function run() {
  await esbuild.build({
    entryPoints: ['src/generate-stremio.ts'],
    outfile: 'dist/gen.js',
    platform: 'node',
    bundle: true,
    format: 'cjs'
  });
  
  console.log('📦 Bundled generator into dist/gen.js');
  
  // Запускаємо згенерований скрипт
  require('./dist/gen.js');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});