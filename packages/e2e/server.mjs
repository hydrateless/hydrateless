// Minimal static file server for the E2E fixtures. It serves the repository
// root so fixture pages can reference the built CSS bundle and the CDN auto
// bundle by absolute path (e.g. /packages/auto/dist/hydrateless.js). No
// dependencies: Playwright's webServer launches this before the suite runs.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, normalize, resolve, extname } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
// packages/e2e -> repository root.
const ROOT = resolve(here, '..', '..');
const PORT = Number(process.argv[2] ?? 4180);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.map': 'application/json; charset=utf-8',
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.endsWith('/')) pathname += 'index.html';
    // Resolve within ROOT and refuse anything that escapes it.
    const filePath = normalize(join(ROOT, pathname));
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403).end('Forbidden');
      return;
    }
    const body = await readFile(filePath);
    res.writeHead(200, {
      'content-type': MIME[extname(filePath)] ?? 'application/octet-stream',
      'cache-control': 'no-store',
    });
    res.end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
});

server.listen(PORT, '127.0.0.1', () => {
  process.stdout.write(`e2e static server: http://127.0.0.1:${PORT} (root: ${ROOT})\n`);
});
