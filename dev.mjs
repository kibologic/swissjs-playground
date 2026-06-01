import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { SwiteServer } from '@kibologic/swite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const server = new SwiteServer({
  root: path.resolve(__dirname, 'app'),
  publicDir: 'public',
  port: 5100,
  host: '0.0.0.0',
  open: false,
});

server.app.use((req, res, next) => {
  if (req.method === 'GET' && req.headers.accept?.includes('text/html')) {
    res.setHeader('Content-Type', 'text/html');
    res.end(readFileSync(path.join(__dirname, 'app/public/index.html'), 'utf-8'));
    return;
  }
  next();
});

await server.start();
console.log('[swissjs-playground] running on http://localhost:5100');
