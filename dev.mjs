import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { SwiteServer } from '@kibologic/swite';
import { UiCompiler } from '@kibologic/compiler';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const compiler = new UiCompiler();

// esbuild sometimes emits var-helpers before import statements.
// Browsers may reject import after executable code, so hoist all imports to top.
function hoistImports(js) {
  const lines = js.split('\n');
  const imports = lines.filter(l => /^\s*import\s+/.test(l));
  const rest = lines.filter(l => !/^\s*import\s+/.test(l));
  return [...imports, ...rest].join('\n');
}

const server = new SwiteServer({
  root: path.resolve(__dirname, 'app'),
  publicDir: 'public',
  port: 5100,
  host: '0.0.0.0',
  open: false,
});

// Compile endpoint — must be registered before the SPA fallback middleware
server.app.use((req, res, next) => {
  if (req.method === 'POST' && req.url === '/api/compile') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', async () => {
      try {
        const { code } = JSON.parse(body);
        const raw = await compiler.compileAsync(code, 'App.uix');
        const js = hoistImports(raw);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ js }));
      } catch (err) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }
  next();
});

server.app.use((req, res, next) => {
  if (req.method === 'GET' && req.headers.accept?.includes('text/html')) {
    const publicPath = path.join(__dirname, 'app/public', req.url.split('?')[0]);
    try {
      const html = readFileSync(publicPath, 'utf-8');
      res.setHeader('Content-Type', 'text/html');
      res.end(html);
    } catch {
      res.setHeader('Content-Type', 'text/html');
      res.end(readFileSync(path.join(__dirname, 'app/public/index.html'), 'utf-8'));
    }
    return;
  }
  next();
});

await server.start();
console.log('[swissjs-playground] running on http://localhost:5100');
