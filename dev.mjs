import { createServer } from '@kibologic/swite';

const isBuild = process.argv.includes('--build');

if (isBuild) {
  const { build } = await import('@kibologic/swite');
  await build({ root: './app', entry: 'main.ui', outDir: 'dist', minify: true });
  console.log('Build complete → dist/');
} else {
  const server = await createServer({ root: './app', port: 5100, entry: 'main.ui' });
  await server.listen();
}
